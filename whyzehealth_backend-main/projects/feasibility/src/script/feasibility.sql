CREATE TABLE IF NOT EXISTS public."Projects"
(
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "ProjectName" character varying COLLATE pg_catalog."default",
    "ClientName" character varying COLLATE pg_catalog."default",
    "Description" character varying COLLATE pg_catalog."default",
    "IsFavourite" boolean DEFAULT false,
    "PatientSegmentReqiured" integer,
    "Created" timestamp without time zone DEFAULT now(),
    "Updated" timestamp without time zone DEFAULT now(),
    "CreatedBy" uuid,
    "UpdatedBy" uuid,
    CONSTRAINT "Projects_pkey" PRIMARY KEY ("Id");
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Projects"
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public."FeasibilityStudy"
(
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "Name" character varying COLLATE pg_catalog."default",
    "IsDone" boolean DEFAULT false,
    "FeasibilityStudy" json,
    "Location" json,
    "SitesContacted" json,
    "SitesInitiated" json,
    "PreferredSites" json,
    "Sites" json,
    "FinalCount" integer,
    "Created" timestamp without time zone DEFAULT now(),
    "Updated" timestamp without time zone DEFAULT now(),
    "CreatedBy" uuid,
    "UpdatedBy" uuid,
    CONSTRAINT "FeasibilityStudy_pkey" PRIMARY KEY ("Id"),
    CONSTRAINT "Projects_Id_fkey" FOREIGN KEY ("ProjectId")
        REFERENCES public."Projects" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."FeasibilityStudy"
    OWNER to postgres;