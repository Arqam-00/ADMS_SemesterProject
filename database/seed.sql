
-- PROVINCES
INSERT INTO Province (province_id, province_name) VALUES
('PB', 'Punjab'),
('SD', 'Sindh'),
('KP', 'Khyber Pakhtunkhwa'),
('BL', 'Balochistan');

-- 2. CITY
INSERT INTO City (city_id, city_name, province_id) VALUES
('LHE', 'Lahore', 'PB'),
('FSD', 'Faisalabad', 'PB'),
('RWP', 'Rawalpindi', 'PB'),
('MUX', 'Multan', 'PB'),
('KHI', 'Karachi', 'SD'),
('HYD', 'Hyderabad', 'SD'),
('PEW', 'Peshawar', 'KP'),
('ABT', 'Abbottabad', 'KP'),
('QTA', 'Quetta', 'BL'),
('GWD', 'Gwadar', 'BL'),
('RYK', 'Rahim Yar Khan', 'PB'),
('BWP', 'Bahawalpur', 'PB'),
('SKR', 'Sukkur', 'SD'),
('MDR', 'Mardan', 'KP');

-- 3. ROLE 
INSERT INTO Role (role_name) VALUES
('Regional Manager'),
('Branch Manager'),
('Senior Officer'),
('Junior Officer'),
('Data Entry Operator');

-- 4. ADDRESS
INSERT INTO Address (building_no, street_no, city_id, landmark, postal_code) VALUES
('House 12', 'Street 3', 'LHE', 'Near Jamia Masjid', '54000'),
('Flat 5', 'Street 8', 'LHE', 'Gulberg Heights', '54660'),
('House 45', 'Street 12', 'LHE', 'Opposite Gaddafi Stadium', '54810'),
('Plot 7', 'Street 2', 'FSD', 'Near D Ground', '38000'),
('House 89', 'Street 5', 'FSD', 'Peoples Colony', '38060'),
('Flat 12', 'Street 7', 'KHI', 'Clifton Block 5', '75600'),
('House 34', 'Street 11', 'KHI', 'Near NIPA Chowrangi', '75210'),
('Plot 23', 'Street 4', 'KHI', 'Defence Phase 2', '75500'),
('House 67', 'Street 9', 'RWP', 'Saddar', '46000'),
('Flat 3', 'Street 6', 'RWP', 'Committee Chowk', '46300'),
('House 23', 'Street 1', 'PEW', 'University Town', '25000'),
('Plot 12', 'Street 3', 'PEW', 'Hayatabad Phase 2', '25100'),
('House 56', 'Street 8', 'QTA', 'Jinnah Town', '87300'),
('Flat 8', 'Street 2', 'QTA', 'Civil Lines', '87400'),
('House 91', 'Street 15', 'MUX', 'Shah Rukn-e-Alam Colony', '60000'),
('Plot 34', 'Street 7', 'MUX', 'Gulgasht Colony', '60700'),
('House 44', 'Street 22', 'HYD', 'Latifabad No 7', '71000'),
('Flat 15', 'Street 5', 'HYD', 'Qasimabad', '71100'),
('House 33', 'Street 9', 'SKR', 'Barrage Colony', '65200'),
('Plot 21', 'Street 4', 'SKR', 'New Pind', '65300'),
('House 19', 'Street 6', 'RYK', 'Sheikh Zayed Colony', '64200'),
('Plot 27', 'Street 3', 'RYK', 'Medical College Road', '64201'),
('House 63', 'Street 14', 'BWP', 'Model Town A', '63100'),
('Flat 51', 'Street 8', 'BWP', 'Shahdrah Housing', '63101'),
('House 72', 'Street 13', 'ABT', 'Jadoon Plaza', '22010');

-- 5. BRANCH 
INSERT INTO Branch (branch_code, branch_name, branch_type, address_id, phone_number, email, opening_time, closing_time) VALUES
('LHR-001', 'Lahore Regional Office', 'regional', 1, '042-1112233', 'lahore.regional@nadra.gov.pk', '09:00', '17:00'),
('LHR-002', 'Lahore City Branch', 'city', 2, '042-4445566', 'lahore.city@nadra.gov.pk', '09:00', '19:00'),
('LHR-003', 'Lahore Mobile Unit', 'mobile', 3, '042-7778899', 'lahore.mobile@nadra.gov.pk', '10:00', '16:00'),
('KHI-001', 'Karachi Regional Office', 'regional', 6, '021-1112233', 'karachi.regional@nadra.gov.pk', '09:00', '17:00'),
('KHI-002', 'Karachi City Branch', 'city', 7, '021-4445566', 'karachi.city@nadra.gov.pk', '09:00', '19:00'),
('RWP-001', 'Rawalpindi City Branch', 'city', 9, '051-4445566', 'rawalpindi.city@nadra.gov.pk', '09:00', '19:00'),
('PEW-001', 'Peshawar Regional Office', 'regional', 11, '091-1112233', 'peshawar.regional@nadra.gov.pk', '09:00', '17:00'),
('QTA-001', 'Quetta Regional Office', 'regional', 13, '081-1112233', 'quetta.regional@nadra.gov.pk', '09:00', '17:00'),
('MUX-001', 'Multan City Branch', 'city', 15, '061-4445566', 'multan.city@nadra.gov.pk', '09:00', '19:00'),
('HYD-001', 'Hyderabad City Branch', 'city', 17, '022-4445566', 'hyderabad.city@nadra.gov.pk', '09:00', '19:00');

-- 6. PERSON 
INSERT INTO Person (cnic, first_name, last_name, gender, date_of_birth) VALUES
-- Iqbal Family (5 members)
('3520112345671', 'Muhammad', 'Iqbal', 'male', '1950-03-15'),
('3520112345672', 'Fatima', 'Iqbal', 'female', '1953-07-22'),
('3520112345673', 'Ahmed', 'Iqbal', 'male', '1975-06-20'),
('3520112345674', 'Sadia', 'Iqbal', 'female', '1978-09-15'),
('3520112345675', 'Ali', 'Iqbal', 'male', '2000-12-01'),

-- Rahman Family (5 members)
('3520112345681', 'Abdul', 'Rahman', 'male', '1952-11-05'),
('3520112345682', 'Zainab', 'Rahman', 'female', '1955-09-18'),
('3520112345683', 'Bilal', 'Rahman', 'male', '1977-03-25'),
('3520112345684', 'Ayesha', 'Rahman', 'female', '1980-08-12'),
('3520112345685', 'Zain', 'Rahman', 'male', '2002-07-24'),

-- Hussain Family (5 members)
('3520112345691', 'Ghulam', 'Hussain', 'male', '1948-04-30'),
('3520112345692', 'Sakina', 'Hussain', 'female', '1951-12-12'),
('3520112345693', 'Hassan', 'Hussain', 'male', '1972-05-05'),
('3520112345694', 'Kiran', 'Hussain', 'female', '1974-11-20'),
('3520112345695', 'Usman', 'Hussain', 'male', '2001-11-15'),

-- Yousuf Family (5 members)
('3520112345701', 'Mohammad', 'Yousuf', 'male', '1958-08-08'),
('3520112345702', 'Nasreen', 'Yousuf', 'female', '1960-02-25'),
('3520112345703', 'Omar', 'Yousuf', 'male', '1982-07-17'),
('3520112345704', 'Sara', 'Yousuf', 'female', '1985-01-09'),
('3520112345705', 'Hamza', 'Yousuf', 'male', '2007-05-30'),

-- Ahmed Family (5 members)
('3520112345711', 'Riaz', 'Ahmed', 'male', '1955-06-14'),
('3520112345712', 'Shamim', 'Ahmed', 'female', '1957-10-30'),
('3520112345713', 'Khalid', 'Ahmed', 'male', '1979-09-30'),
('3520112345714', 'Nadia', 'Ahmed', 'female', '1982-04-22'),
('3520112345715', 'Salman', 'Ahmed', 'male', '2006-10-05'),

-- Mehmood Family (5 members)
('4130112345721', 'Tariq', 'Mehmood', 'male', '1976-12-03'),
('4130112345722', 'Rabia', 'Mehmood', 'female', '1978-08-19'),
('4130112345723', 'Haris', 'Mehmood', 'male', '2002-06-11'),
('4130112345724', 'Laiba', 'Mehmood', 'female', '2004-09-17'),
('4130112345725', 'Sana', 'Khan', 'female', '1983-06-27'),

-- Khan Family (5 members)
('4130112345731', 'Imran', 'Khan', 'male', '1980-02-14'),
('4130112345732', 'Sana', 'Khan', 'female', '1983-06-27'),
('4130112345733', 'Ahmad', 'Khan', 'male', '2005-01-25'),
('4130112345734', 'Zara', 'Khan', 'female', '2007-04-02'),
('4130112345735', 'Faisal', 'Chaudhry', 'male', '1977-10-11'),

-- Chaudhry Family (5 members)
('4130112345741', 'Faisal', 'Chaudhry', 'male', '1977-10-11'),
('4130112345742', 'Hina', 'Chaudhry', 'female', '1981-03-08'),
('4130112345743', 'Saad', 'Chaudhry', 'male', '2003-08-09'),
('4130112345744', 'Maha', 'Chaudhry', 'female', '2006-11-13'),
('4130112345745', 'Waqas', 'Malik', 'male', '1984-05-19'),

-- Malik Family (5 members)
('5230112345751', 'Waqas', 'Malik', 'male', '1984-05-19'),
('5230112345752', 'Mahnoor', 'Malik', 'female', '1986-09-23'),
('5230112345753', 'Rayan', 'Malik', 'male', '2008-03-27'),
('5230112345754', 'Ayesha', 'Malik', 'female', '2010-07-19'),
('5230112345755', 'Abdul', 'Malik', 'male', '1975-02-11'),

-- Baloch Family (5 members)
('5230112345761', 'Abdul', 'Malik', 'male', '1975-02-11'),
('5230112345762', 'Bilquis', 'Malik', 'female', '1978-05-19'),
('5230112345763', 'Gul', 'Khan', 'male', '1980-08-27'),
('5230112345764', 'Shamim', 'Khan', 'female', '1982-11-03'),
('5230112345765', 'Rashid', 'Ahmed', 'male', '1985-01-08');

-- 7. CITIZEN 
INSERT INTO Citizen (cnic, date_of_death) VALUES
('3520112345671', NULL), ('3520112345672', NULL), ('3520112345673', NULL),
('3520112345674', NULL), ('3520112345675', NULL), ('3520112345681', NULL),
('3520112345682', NULL), ('3520112345683', NULL), ('3520112345684', NULL),
('3520112345685', NULL), ('3520112345691', '2020-05-15'), ('3520112345692', NULL),
('3520112345693', NULL), ('3520112345694', NULL), ('3520112345695', NULL),
('3520112345701', NULL), ('3520112345702', NULL), ('3520112345703', NULL),
('3520112345704', NULL), ('3520112345705', NULL), ('3520112345711', NULL),
('3520112345712', '2022-11-20'), ('3520112345713', NULL), ('3520112345714', NULL),
('3520112345715', NULL), ('4130112345721', NULL), ('4130112345722', NULL),
('4130112345723', NULL), ('4130112345724', NULL), ('4130112345725', NULL),
('4130112345731', NULL), ('4130112345732', NULL), ('4130112345733', NULL),
('4130112345734', NULL), ('4130112345735', NULL), ('4130112345741', NULL),
('4130112345742', NULL), ('4130112345743', NULL), ('4130112345744', NULL),
('4130112345745', NULL), ('5230112345751', NULL), ('5230112345752', NULL),
('5230112345753', NULL), ('5230112345754', NULL), ('5230112345755', NULL),
('5230112345761', NULL), ('5230112345762', NULL), ('5230112345763', NULL),
('5230112345764', NULL), ('5230112345765', NULL);

-- 8. OFFICER 
INSERT INTO Officer (cnic, employee_id, email, phone_number, address_id, branch_id, role_id, joining_date, password_hash) VALUES
('3520112345673', 'NAD-001', 'ahmed.iqbal@nadra.gov.pk', '0300-1234567', 1, 1, 1, '2010-03-15', 'hash_ahmed_001'),
('3520112345683', 'NAD-002', 'bilal.rahman@nadra.gov.pk', '0301-2345678', 4, 2, 2, '2012-06-20', 'hash_bilal_002'),
('3520112345693', 'NAD-003', 'hassan.hussain@nadra.gov.pk', '0302-3456789', 5, 3, 3, '2013-09-10', 'hash_hassan_003'),
('3520112345703', 'NAD-004', 'omar.yousuf@nadra.gov.pk', '0303-4567890', 9, 4, 4, '2014-11-05', 'hash_omar_004'),
('3520112345713', 'NAD-005', 'khalid.ahmed@nadra.gov.pk', '0304-5678901', 10, 5, 5, '2015-02-18', 'hash_khalid_005'),
('4130112345721', 'NAD-006', 'tariq.mehmood@nadra.gov.pk', '0305-6789012', 19, 6, 3, '2016-04-22', 'hash_tariq_006'),
('4130112345731', 'NAD-007', 'imran.khan@nadra.gov.pk', '0306-7890123', 20, 7, 2, '2017-07-30', 'hash_imran_007'),
('4130112345741', 'NAD-008', 'faisal.chaudhry@nadra.gov.pk', '0307-8901234', 21, 8, 4, '2018-08-14', 'hash_faisal_008'),
('5230112345751', 'NAD-009', 'waqas.malik@nadra.gov.pk', '0308-9012345', 22, 9, 1, '2019-09-19', 'hash_waqas_009'),
('5230112345761', 'NAD-010', 'abdul.malik@nadra.gov.pk', '0309-0123456', 13, 10, 3, '2015-11-11', 'hash_abdul_010'),
('4130112345725', 'NAD-011', 'sana.khan@nadra.gov.pk', '0310-1234567', 23, 2, 4, '2016-12-12', 'hash_sana_011'),
('5230112345763', 'NAD-012', 'gul.khan@nadra.gov.pk', '0311-2345678', 24, 8, 5, '2017-01-13', 'hash_gul_012');

-- 9. PARENTS (32 relationships - each child has exactly 2 parents)
INSERT INTO Parents (child_cnic, father_cnic, mother_cnic) VALUES
-- Iqbal family children
('3520112345673', '3520112345671', '3520112345672'),  -- Ahmed's parents
('3520112345674', '3520112345671', '3520112345672'),  -- Sadia's parents
('3520112345675', '3520112345673', '3520112345674'),  -- Ali's parents

-- Rahman family children
('3520112345683', '3520112345681', '3520112345682'),  -- Bilal's parents
('3520112345684', '3520112345681', '3520112345682'),  -- Ayesha's parents
('3520112345685', '3520112345683', '3520112345684'),  -- Zain's parents

-- Hussain family children
('3520112345693', '3520112345691', '3520112345692'),  -- Hassan's parents
('3520112345694', '3520112345691', '3520112345692'),  -- Kiran's parents
('3520112345695', '3520112345693', '3520112345694'),  -- Usman's parents

-- Yousuf family children
('3520112345703', '3520112345701', '3520112345702'),  -- Omar's parents
('3520112345704', '3520112345701', '3520112345702'),  -- Sara's parents
('3520112345705', '3520112345703', '3520112345704'),  -- Hamza's parents

-- Ahmed family children
('3520112345713', '3520112345711', '3520112345712'),  -- Khalid's parents
('3520112345714', '3520112345711', '3520112345712'),  -- Nadia's parents
('3520112345715', '3520112345713', '3520112345714'),  -- Salman's parents

-- Mehmood family children
('4130112345723', '4130112345721', '4130112345722'),  -- Haris's parents
('4130112345724', '4130112345721', '4130112345722'),  -- Laiba's parents

-- Khan family children
('4130112345733', '4130112345731', '4130112345732'),  -- Ahmad's parents
('4130112345734', '4130112345731', '4130112345732'),  -- Zara's parents

-- Chaudhry family children
('4130112345743', '4130112345741', '4130112345742'),  -- Saad's parents
('4130112345744', '4130112345741', '4130112345742'),  -- Maha's parents

-- Malik family children
('5230112345753', '5230112345751', '5230112345752'),  -- Rayan's parents
('5230112345754', '5230112345751', '5230112345752'),  -- Ayesha's parents

-- Baloch family children
('5230112345763', '5230112345761', '5230112345762'),  -- Gul's parents
('5230112345764', '5230112345761', '5230112345762'),  -- Shamim's parents
('5230112345765', '5230112345763', '5230112345764');  -- Rashid's parents

-- 10. MARRIAGE (12 marriages - each couple once)
INSERT INTO Marriage (husband_cnic, wife_cnic, marriage_date, divorce_date) VALUES
('3520112345671', '3520112345672', '1970-05-20', NULL),
('3520112345681', '3520112345682', '1972-08-15', NULL),
('3520112345691', '3520112345692', '1968-03-10', '2015-06-30'),
('3520112345701', '3520112345702', '1978-11-25', NULL),
('3520112345711', '3520112345712', '1975-09-05', NULL),
('3520112345673', '3520112345674', '1998-12-12', NULL),
('3520112345683', '3520112345684', '2000-04-18', NULL),
('3520112345693', '3520112345694', '1996-07-22', NULL),
('3520112345703', '3520112345704', '2002-01-30', NULL),
('3520112345713', '3520112345714', '2001-08-14', NULL),
('4130112345721', '4130112345722', '1999-03-25', NULL),
('4130112345731', '4130112345732', '2003-06-17', NULL);

-- 11. CITIZEN_ADDRESS (20 unique assignments - each person has current address)
INSERT INTO Citizen_Address (citizen_cnic, address_id, valid_from, valid_to) VALUES
('3520112345671', 1, '1970-01-01', NULL),
('3520112345672', 1, '1970-01-01', NULL),
('3520112345673', 2, '1998-01-01', '2010-12-31'),
('3520112345673', 3, '2011-01-01', NULL),
('3520112345674', 2, '1998-01-01', '2010-12-31'),
('3520112345674', 3, '2011-01-01', NULL),
('3520112345675', 4, '2020-01-01', NULL),
('3520112345681', 5, '1972-01-01', NULL),
('3520112345682', 5, '1972-01-01', NULL),
('3520112345683', 6, '2000-01-01', NULL),
('3520112345684', 6, '2000-01-01', NULL),
('4130112345721', 17, '1999-01-01', NULL),
('4130112345722', 17, '1999-01-01', NULL),
('4130112345731', 18, '2003-01-01', NULL),
('4130112345732', 18, '2003-01-01', NULL),
('5230112345751', 23, '2008-01-01', NULL),
('5230112345752', 23, '2008-01-01', NULL),
('5230112345761', 13, '2000-01-01', '2015-12-31'),
('5230112345761', 14, '2016-01-01', NULL),
('5230112345762', 13, '2000-01-01', '2015-12-31'),
('5230112345762', 14, '2016-01-01', NULL);

-- 12. APPLICATION (20 applications)
INSERT INTO Application (citizen_cnic, application_type, assigned_officer_cnic, status, submitted_at, processed_at) VALUES
('3520112345675', 'new', '3520112345673', 'approved', '2023-01-15 10:30:00', '2023-01-20 14:25:00'),
('3520112345685', 'new', '3520112345683', 'approved', '2023-02-10 11:45:00', '2023-02-15 09:30:00'),
('3520112345695', 'new', '3520112345693', 'approved', '2023-03-05 09:15:00', '2023-03-10 16:20:00'),
('3520112345705', 'new', '3520112345703', 'approved', '2023-04-12 14:20:00', '2023-04-18 11:10:00'),
('3520112345715', 'new', '3520112345713', 'approved', '2023-05-08 10:50:00', '2023-05-12 13:45:00'),
('3520112345673', 'renewal', '4130112345721', 'approved', '2023-11-01 09:00:00', '2023-11-05 14:15:00'),
('3520112345683', 'renewal', '4130112345731', 'approved', '2023-11-10 11:20:00', '2023-11-15 10:30:00'),
('3520112345693', 'renewal', '5230112345751', 'approved', '2023-11-15 13:45:00', '2023-11-20 16:10:00'),
('3520112345703', 'replacement', '5230112345761', 'approved', '2023-12-01 09:30:00', '2023-12-05 13:40:00'),
('3520112345713', 'replacement', '4130112345725', 'approved', '2023-12-05 11:50:00', '2023-12-10 10:25:00'),
('4130112345723', 'new', '5230112345763', 'approved', '2024-01-05 09:15:00', '2024-01-10 14:50:00'),
('4130112345724', 'new', '3520112345673', 'approved', '2024-01-10 11:40:00', '2024-01-15 10:35:00'),
('4130112345733', 'new', '3520112345683', 'pending', '2024-02-01 09:45:00', NULL),
('4130112345734', 'new', '3520112345693', 'processing', '2024-02-02 11:20:00', NULL),
('4130112345743', 'new', '3520112345703', 'approved', '2024-02-06 09:00:00', '2024-02-10 13:20:00'),
('4130112345744', 'new', '3520112345713', 'approved', '2024-02-07 11:35:00', '2024-02-12 10:40:00'),
('5230112345753', 'new', '4130112345721', 'approved', '2024-02-11 09:20:00', '2024-02-16 14:35:00'),
('5230112345754', 'new', '4130112345731', 'approved', '2024-02-12 11:55:00', '2024-02-17 10:50:00'),
('5230112345763', 'renewal', '5230112345751', 'approved', '2024-02-13 14:30:00', '2024-02-18 16:15:00'),
('5230112345764', 'renewal', '5230112345761', 'approved', '2024-02-14 10:10:00', '2024-02-19 11:45:00');

-- 13. PAYMENT (One per application)
INSERT INTO Payment (application_id, amount, payment_method, payment_status, paid_at, received_by_cnic) VALUES
(1, 750.00, 'cash', 'completed', '2023-01-15 10:35:00', '3520112345673'),
(2, 750.00, 'cash', 'completed', '2023-02-10 11:50:00', '3520112345683'),
(3, 750.00, 'debit_card', 'completed', '2023-03-05 09:20:00', '3520112345693'),
(4, 750.00, 'bank_transfer', 'completed', '2023-04-12 14:25:00', '3520112345703'),
(5, 750.00, 'cash', 'completed', '2023-05-08 10:55:00', '3520112345713'),
(6, 500.00, 'cash', 'completed', '2023-11-01 09:05:00', '4130112345721'),
(7, 500.00, 'debit_card', 'completed', '2023-11-10 11:25:00', '4130112345731'),
(8, 500.00, 'bank_transfer', 'completed', '2023-11-15 13:50:00', '5230112345751'),
(9, 1000.00, 'cash', 'completed', '2023-12-01 09:35:00', '5230112345761'),
(10, 1000.00, 'debit_card', 'completed', '2023-12-05 11:55:00', '4130112345725'),
(11, 750.00, 'bank_transfer', 'completed', '2024-01-05 09:20:00', '5230112345763'),
(12, 750.00, 'cash', 'completed', '2024-01-10 11:45:00', '3520112345673'),
(13, 750.00, 'cash', 'pending', NULL, NULL),
(14, 750.00, 'debit_card', 'completed', '2024-02-02 11:25:00', '3520112345693'),
(15, 750.00, 'cash', 'completed', '2024-02-06 09:05:00', '3520112345703'),
(16, 750.00, 'bank_transfer', 'completed', '2024-02-07 11:40:00', '3520112345713'),
(17, 750.00, 'cash', 'completed', '2024-02-11 09:25:00', '4130112345721'),
(18, 750.00, 'debit_card', 'completed', '2024-02-12 12:00:00', '4130112345731'),
(19, 500.00, 'bank_transfer', 'completed', '2024-02-13 14:35:00', '5230112345751'),
(20, 500.00, 'cash', 'completed', '2024-02-14 10:15:00', '5230112345761');

-- 14. ID_CARD (18 cards - one per approved application)
INSERT INTO ID_Card (card_number, application_id, issue_date, expiry_date, version_number, is_active) VALUES
('34101-1234567-1', 1, '2023-01-20', '2033-01-20', 1, TRUE),
('34102-2345678-1', 2, '2023-02-15', '2033-02-15', 1, TRUE),
('34103-3456789-1', 3, '2023-03-10', '2033-03-10', 1, TRUE),
('34104-4567890-1', 4, '2023-04-18', '2033-04-18', 1, TRUE),
('34105-5678901-1', 5, '2023-05-12', '2033-05-12', 1, TRUE),
('34101-1234567-2', 6, '2023-11-05', '2033-11-05', 2, TRUE),
('34102-2345678-2', 7, '2023-11-15', '2033-11-15', 2, TRUE),
('34103-3456789-2', 8, '2023-11-20', '2033-11-20', 2, TRUE),
('34201-6789012-1', 9, '2023-12-05', '2033-12-05', 1, TRUE),
('34202-7890123-1', 10, '2023-12-10', '2033-12-10', 1, TRUE),
('34301-1234567-1', 11, '2024-01-10', '2034-01-10', 1, TRUE),
('34302-2345678-1', 12, '2024-01-15', '2034-01-15', 1, TRUE),
('34401-6789012-1', 15, '2024-02-10', '2034-02-10', 1, TRUE),
('34402-7890123-1', 16, '2024-02-12', '2034-02-12', 1, TRUE),
('34403-8901234-1', 17, '2024-02-16', '2034-02-16', 1, TRUE),
('34404-9012345-1', 18, '2024-02-17', '2034-02-17', 1, TRUE),
('34501-1234567-1', 19, '2024-02-18', '2034-02-18', 1, TRUE),
('34502-2345678-1', 20, '2024-02-19', '2034-02-19', 1, TRUE);

-- 15. B_FORM (10 child registration certificates)
INSERT INTO B_Form (application_id, child_cnic, birth_registration_number, place_of_birth) VALUES
(1, '3520112345675', 'BR-2020-001', 'Jinnah Hospital, Lahore'),
(2, '3520112345685', 'BR-2020-002', 'Allied Hospital, Faisalabad'),
(3, '3520112345695', 'BR-2021-003', 'DHQ Hospital, Rawalpindi'),
(4, '3520112345705', 'BR-2022-004', 'Lady Reading Hospital, Peshawar'),
(5, '3520112345715', 'BR-2022-005', 'Nishtar Hospital, Multan'),
(11, '4130112345723', 'BR-2023-006', 'Civil Hospital, Karachi'),
(12, '4130112345724', 'BR-2023-007', 'Jinnah Hospital, Karachi'),
(15, '4130112345743', 'BR-2024-008', 'Gujranwala Medical College'),
(16, '4130112345744', 'BR-2024-009', 'Bolan Medical College, Quetta'),
(17, '5230112345753', 'BR-2024-010', 'Ayub Teaching Hospital, Abbottabad');
-- drop database CitizenIdentityManagement;

-- Triggers
DELIMITER $$

CREATE TRIGGER trg_deactivate_old_card
BEFORE INSERT ON ID_Card
FOR EACH ROW
BEGIN
    UPDATE ID_Card
    SET is_active = FALSE
    WHERE application_id IN (
        SELECT application_id
        FROM Application
        WHERE citizen_cnic = (
            SELECT citizen_cnic
            FROM Application
            WHERE application_id = NEW.application_id
        )
    );
END $$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER trg_set_processed_time
BEFORE UPDATE ON Application
FOR EACH ROW
BEGIN
    IF NEW.status IN ('approved','rejected') 
       AND OLD.status != NEW.status THEN
        SET NEW.processed_at = NOW();
    END IF;
END $$

DELIMITER ;