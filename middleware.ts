import * as jose from "https://deno.land/x/jose@v4.3.7/index.ts";

import UserEntity from "./entity/UserEntity.ts";
import UserCollection from "./collection/UserCollection.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.4/repository/GeneralRepository.ts";

interface Pair {
  [key: string]: string;
}

import { Request, State } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import {
  InvalidAuthorization,
  MissingAuthorization,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.4/errors.ts";

export async function verifyFirebase(
  { request, state }: {
    request: Request;
    state: State;
  },
  next: () => Promise<unknown>,
): Promise<void> {
  const bearer = request.headers.get("Authorization");

  if (!bearer) {
    throw new MissingAuthorization();
  }

  const token = bearer?.split("Bearer ")[1];

  if (!token) {
    throw new InvalidAuthorization();
  }
  const userRepository = new GeneralRepository(
    "user",
    UserEntity,
    UserCollection,
  );

  const keysResponse = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
  );
  const keysParsed = await keysResponse.json() as Pair;
  const keysArray = Object.entries(keysParsed);

  const verifyAlgo = "RS256";
  const verifyKeys = keysArray.map((verifyPair) => verifyPair[1]);

  const verifyPromises = verifyKeys.map(async (key) => {
    try {
      const verifyPublic = await jose.importX509(key, verifyAlgo);
      const verifyResults = await jose.jwtVerify(token, verifyPublic);

      return verifyResults;
    } catch {
      return false;
    }
  });

  const verifyResults = await Promise.all(verifyPromises);
  const verifyResult = verifyResults.find((result) => result !== false);

  if (!verifyResult) {
    throw new InvalidAuthorization();
  }

  const userEntity = await userRepository.getObjectBy(
    "firebase",
    verifyResult?.payload?.sub!,
  ) as UserEntity;

  state.user = userEntity.uuid.getValue();
  state.network = userEntity.network.getValue();

  await next();

  return;
}
