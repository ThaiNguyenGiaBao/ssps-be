CREATE TABLE "User" (
     id SERIAL PRIMARY KEY,  
    username VARCHAR NOT NULL,                     -- Username column
    avatarUrl VARCHAR,                             -- Avatar URL column
    email VARCHAR UNIQUE NOT NULL,                -- Unique email column
    password VARCHAR NOT NULL,                     -- Password column
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,       -- Admin status, default to FALSE
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),   -- Created at timestamp
);