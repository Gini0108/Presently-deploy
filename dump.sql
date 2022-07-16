CREATE TABLE worker (
	uuid BINARY(16) NOT NULL,

	title VARCHAR(255),
	serial VARCHAR(255) NOT NULL,
	online TINYINT(1) NOT NULL DEFAULT 0,

	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	PRIMARY KEY (uuid),
	UNIUQUE KEY (serial)
)

CREATE TABLE file (
	uuid BINARY(16) NOT NULL,

	name VARCHAR(255) NOT NULL,
	type VARCHAR(255) NOT NULL,

	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	PRIMARY KEY (uuid)
)

ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;