CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE location (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campusname VARCHAR(255) NOT NULL,
    buildingname VARCHAR(255) NOT NULL,
    roomnumber INT NOT NULL
);

CREATE TABLE printer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    shortDescription TEXT,
    status VARCHAR(50) NOT NULL,
    locationId UUID REFERENCES Location(id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatarUrl TEXT,
    role VARCHAR(255) DEFAULT 'user',
    coinBalance INT DEFAULT 0
);

CREATE TABLE file (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    fileName VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE PrintingJob (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    printerId UUID REFERENCES Printer(id),
    userId UUID REFERENCES users(id),
    fileId UUID REFERENCES File(id),
    startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paperSize VARCHAR(50),
    numPage INT,
    numSide INT,
    numCopy INT,
    colorType VARCHAR(50),
    orientation VARCHAR(50),
    status VARCHAR(50) NOT NULL
);

CREATE TABLE configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    defaultNumPage INT,
    dateGivePage DATE
);

CREATE TABLE permitedFile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(255) NOT NULL,
    isEnable boolean DEFAULT true
);

CREATE TABLE Report (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50),
    description TEXT
);

CREATE TABLE Event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50),
    description TEXT
);

CREATE TABLE ReportEventR (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reportId UUID REFERENCES Report(id),
    eventId UUID REFERENCES Event(id)
);