CREATE TABLE "Tournaments" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"info" TEXT,
	CONSTRAINT Tournaments_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "TournamentEditions" (
	"id" serial NOT NULL,
	"tournamentId" integer NOT NULL,
	"name" varchar NOT NULL,
	"info" TEXT,
	"registrationDate" DATETIME NOT NULL,
	"startDate" DATETIME NOT NULL,
	"playerCount" integer NOT NULL,
	"tournamentType" integer NOT NULL,
	CONSTRAINT TournamentEditions_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "Users" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"birthDate" DATETIME NOT NULL,
	"telephone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"username" varchar NOT NULL,
	"passwordHash" varchar NOT NULL,
	"passwordSalt" varchar NOT NULL,
	"isActive" BOOLEAN NOT NULL,
	"role" integer NOT NULL,
	CONSTRAINT Users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "Matches" (
	"id" serial NOT NULL,
	"tournamentEditionId" integer NOT NULL,
	"player1Id" integer NOT NULL,
	"player2Id" integer NOT NULL,
	"winnerId" integer NOT NULL,
	"result" varchar,
	"startTime" DATETIME NOT NULL,
	"info" TEXT,
	"bracket" integer NOT NULL,
	CONSTRAINT Matches_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "TournamentSchemes" (
	"id" serial NOT NULL,
	CONSTRAINT TournamentSchemes_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "TournamentNews" (
	"id" serial NOT NULL,
	"tournamentId" integer NOT NULL,
	"news" TEXT NOT NULL,
	CONSTRAINT TournamentNews_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "TournamentRanklists" (
	"id" serial NOT NULL,
	"tournamentId" integer NOT NULL,
	"playerId" integer NOT NULL,
	"score" FLOAT NOT NULL,
	CONSTRAINT TournamentRanklists_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "TournamentEditions" ADD CONSTRAINT "TournamentEditions_fk0" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id");


ALTER TABLE "Matches" ADD CONSTRAINT "Matches_fk0" FOREIGN KEY ("tournamentEditionId") REFERENCES "TournamentEditions"("id");
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_fk1" FOREIGN KEY ("player1Id") REFERENCES "Users"("id");
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_fk2" FOREIGN KEY ("player2Id") REFERENCES "Users"("id");
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_fk3" FOREIGN KEY ("winnerId") REFERENCES "Users"("id");


ALTER TABLE "TournamentNews" ADD CONSTRAINT "TournamentNews_fk0" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id");

ALTER TABLE "TournamentRanklists" ADD CONSTRAINT "TournamentRanklists_fk0" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id");
ALTER TABLE "TournamentRanklists" ADD CONSTRAINT "TournamentRanklists_fk1" FOREIGN KEY ("playerId") REFERENCES "Users"("id");

