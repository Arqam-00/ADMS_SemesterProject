
-- Triggers are placed at the end of seed.sql
Create database CitizenIdentityManagement;
use CitizenIdentityManagement;
CREATE TABLE Person (
    cnic VARCHAR(13) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Citizen (
    cnic VARCHAR(13) PRIMARY KEY,
    date_of_death DATE NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cnic) REFERENCES Person(cnic)
);

CREATE TABLE Parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    child_cnic VARCHAR(13) NOT NULL,
    father_cnic VARCHAR(13) NULL,
    mother_cnic VARCHAR(13) NULL,
    FOREIGN KEY (child_cnic) REFERENCES Person(cnic),
    FOREIGN KEY (father_cnic) REFERENCES Person(cnic),
    FOREIGN KEY (mother_cnic) REFERENCES Person(cnic),
    UNIQUE KEY unique_child (child_cnic),
    CHECK (child_cnic != father_cnic AND child_cnic != mother_cnic)
);

CREATE TABLE Marriage (
    marriage_id INT PRIMARY KEY AUTO_INCREMENT,
    husband_cnic VARCHAR(13) NOT NULL,
    wife_cnic VARCHAR(13) NOT NULL,
    marriage_date DATE NOT NULL,
    divorce_date DATE NULL,
    FOREIGN KEY (husband_cnic) REFERENCES Person(cnic),
    FOREIGN KEY (wife_cnic) REFERENCES Person(cnic),
    UNIQUE KEY unique_active_marriage (husband_cnic, wife_cnic, divorce_date),
    CHECK (husband_cnic != wife_cnic)
);

CREATE TABLE Province (
    province_id VARCHAR(50) PRIMARY KEY,
    province_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE City (
    city_id VARCHAR(50) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    province_id VARCHAR(50)  NOT NULL,
    FOREIGN KEY (province_id) REFERENCES Province(province_id),
    UNIQUE KEY unique_city_province (city_name, province_id)
);

CREATE TABLE Address (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    building_no VARCHAR(50) NOT NULL,
    street_no VARCHAR(50) NOT NULL,
    city_id VARCHAR(50) NOT NULL,
    landmark VARCHAR(255),
    postal_code VARCHAR(20),
    FOREIGN KEY (city_id) REFERENCES City(city_id)
);

CREATE TABLE Branch (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    branch_code VARCHAR(20) UNIQUE NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    branch_type ENUM('regional', 'city', 'mobile') NOT NULL,
    address_id INT NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    opening_time TIME,
    closing_time TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Officer (
    cnic VARCHAR(13) PRIMARY KEY,  
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    address_id INT NOT NULL,
    branch_id INT NOT NULL,
    role_id INT NOT NULL,
    joining_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cnic) REFERENCES Person(cnic),
    FOREIGN KEY (address_id) REFERENCES Address(address_id),
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE TABLE Citizen_Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_cnic VARCHAR(13) NOT NULL,  
    address_id INT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NULL,
    FOREIGN KEY (citizen_cnic) REFERENCES Citizen(cnic), 
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE TABLE Application (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_cnic VARCHAR(13) NOT NULL,
    application_type ENUM('new', 'renewal', 'replacement', 'correction') NOT NULL,
    assigned_officer_cnic VARCHAR(13) NULL,  -- Changed to VARCHAR(13)
    status ENUM('pending', 'processing', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME NULL,
    FOREIGN KEY (citizen_cnic) REFERENCES Citizen(cnic),
    FOREIGN KEY (assigned_officer_cnic) REFERENCES Officer(cnic)  
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'debit_card', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'completed', 'refunded') DEFAULT 'pending',
    paid_at DATETIME NULL,
    received_by_cnic VARCHAR(13) NULL,  -- Changed to VARCHAR(13)
    FOREIGN KEY (application_id) REFERENCES Application(application_id),
    FOREIGN KEY (received_by_cnic) REFERENCES Officer(cnic)  -- Fixed reference
);

CREATE TABLE ID_Card (
    id_card_id INT PRIMARY KEY AUTO_INCREMENT,
    card_number VARCHAR(15) UNIQUE NOT NULL,
    application_id INT NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    version_number INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES Application(application_id),
    INDEX idx_active (is_active)
);

CREATE TABLE B_Form (
    b_form_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL UNIQUE, 
    child_cnic VARCHAR(13) UNIQUE NOT NULL,
    birth_registration_number VARCHAR(30) UNIQUE,
    place_of_birth VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES Application(application_id),
    FOREIGN KEY (child_cnic) REFERENCES Citizen(cnic)
);

-- Constraints
ALTER TABLE ID_Card
ADD CONSTRAINT chk_expiry_after_issue
CHECK (expiry_date > issue_date);
ALTER TABLE Marriage
ADD CONSTRAINT chk_divorce_after_marriage
CHECK (divorce_date IS NULL OR divorce_date > marriage_date);
ALTER TABLE Citizen_Address
ADD CONSTRAINT chk_address_dates
CHECK (valid_to IS NULL OR valid_to > valid_from);
 



-- Views
CREATE VIEW vw_citizen_profile AS
SELECT 
    p.cnic,
    p.first_name,
    p.last_name,
    p.gender,
    p.date_of_birth,
    c.date_of_death
FROM Person p
JOIN Citizen c ON p.cnic = c.cnic;
CREATE VIEW vw_active_id_cards AS
SELECT 
    ic.card_number,
    a.citizen_cnic,
    ic.issue_date,
    ic.expiry_date
FROM ID_Card ic
JOIN Application a ON ic.application_id = a.application_id
WHERE ic.is_active = TRUE;
CREATE VIEW vw_officer_workload AS
SELECT 
    o.employee_id,
    COUNT(a.application_id) AS total_applications
FROM Officer o
LEFT JOIN Application a 
ON o.cnic = a.assigned_officer_cnic
GROUP BY o.employee_id;

