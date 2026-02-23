use CitizenIdentityManagement;
-- Grandparents who are alive
Explain Analyze SELECT distinct
    c.cnic AS grandparent_cnic,
    p.first_name,
    p.last_name,
    c.date_of_death
FROM Parents child
JOIN Parents parent
    ON parent.child_cnic IN (child.father_cnic, child.mother_cnic)
JOIN Citizen c
    ON c.cnic IN (parent.father_cnic, parent.mother_cnic)
JOIN Person p
    ON p.cnic = c.cnic
WHERE child.child_cnic = '3520112345675'
  AND c.date_of_death IS NULL;

-- Officers who approved Applications from their relatives
Explain Analyze SELECT DISTINCT
    o.employee_id,
    a.citizen_cnic AS relative_cnic
FROM Officer o
JOIN Application a ON a.assigned_officer_cnic = o.cnic
JOIN Parents p ON p.child_cnic = a.citizen_cnic
WHERE o.cnic IN (p.father_cnic, p.mother_cnic);

-- Citizen Who changed their address more than once
Explain Analyze SELECT ca.citizen_cnic, COUNT(*) AS address_changes
FROM Citizen_Address ca
GROUP BY ca.citizen_cnic
HAVING COUNT(*) > 1
AND ca.citizen_cnic;

-- Citizen living in different city then birth city
Explain Analyze SELECT p.cnic,b.place_of_birth,a.city_id as Current_Address
    FROM Person p
    JOIN B_Form b ON b.child_cnic = p.cnic
    JOIN Citizen_Address ca2 
        ON ca2.citizen_cnic = p.cnic AND ca2.valid_to IS NULL
    JOIN Address a ON a.address_id = ca2.address_id
    WHERE b.place_of_birth <> a.city_id;
    
-- Indexing
CREATE INDEX idx_person_name 
ON Person(first_name, last_name);
CREATE INDEX idx_application_status 
ON Application(status);

CREATE INDEX idx_application_officer 
ON Application(assigned_officer_cnic);

CREATE INDEX idx_branch_type 
ON Branch(branch_type);

CREATE INDEX idx_idcard_cardnumber 
ON ID_Card(card_number);

Explain Analyze SELECT distinct
    c.cnic AS grandparent_cnic,
    p.first_name,
    p.last_name,
    c.date_of_death
FROM Parents child
JOIN Parents parent
    ON parent.child_cnic IN (child.father_cnic, child.mother_cnic)
JOIN Citizen c
    ON c.cnic IN (parent.father_cnic, parent.mother_cnic)
JOIN Person p
    ON p.cnic = c.cnic
WHERE child.child_cnic = '3520112345675'
  AND c.date_of_death IS NULL;

-- Officers who approved Applications from their relatives
Explain Analyze SELECT DISTINCT
    o.employee_id,
    a.citizen_cnic AS relative_cnic
FROM Officer o
JOIN Application a ON a.assigned_officer_cnic = o.cnic
JOIN Parents p ON p.child_cnic = a.citizen_cnic
WHERE o.cnic IN (p.father_cnic, p.mother_cnic);

-- Citizen Who changed their address more than once
Explain Analyze SELECT ca.citizen_cnic, COUNT(*) AS address_changes
FROM Citizen_Address ca
GROUP BY ca.citizen_cnic
HAVING COUNT(*) > 1
AND ca.citizen_cnic;

-- Citizen living in different city then birth city
Explain Analyze SELECT p.cnic,b.place_of_birth,a.city_id as Current_Address
    FROM Person p
    JOIN B_Form b ON b.child_cnic = p.cnic
    JOIN Citizen_Address ca2 
        ON ca2.citizen_cnic = p.cnic AND ca2.valid_to IS NULL
    JOIN Address a ON a.address_id = ca2.address_id
    WHERE b.place_of_birth <> a.city_id;
