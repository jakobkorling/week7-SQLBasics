-- Skill 2

-- 1. Which columns in cd.bookings are foreign keys, and which tables do they point to?
-- facid is a foreign key that points to facid in cd.facilities.
-- memid is a foreign key that points to memid in cd.members.

-- 2. What relationship exists between members and facilities?
-- Which table plays the role of a junction table?
-- Members and facilities have a many-to-many relationship.
-- cd.bookings is the junction table that connects members and facilities.

-- 3. The recommendedby column in cd.members points back to cd.members itself.
-- What kind of relationship is this?
-- It is a self-referencing relationship.
-- recommendedby refers to the memid of another member in the same table.

-- Skill 3

-- 1. Retrieve the start times of members' bookings
SELECT bks.starttime
FROM cd.bookings bks
JOIN cd.members mem ON mem.memid = bks.memid
WHERE mem.firstname = 'David'
AND mem.surname = 'Farrell';

-- 2. Work out the start times of bookings for tennis courts
SELECT
    bks.starttime,
    fac.name
FROM cd.bookings bks
JOIN cd.facilities fac ON fac.facid = bks.facid
WHERE fac.name LIKE 'Tennis Court%'
AND bks.starttime >= '2012-09-21'
AND bks.starttime < '2012-09-22'
ORDER BY bks.starttime;

-- 3. Produce a list of all members who have recommended another member
SELECT DISTINCT
    rec.surname,
    rec.firstname
FROM cd.members mem
JOIN cd.members rec ON mem.recommendedby = rec.memid
ORDER BY rec.surname, rec.firstname;

-- 4. Produce a list of all members, along with their recommender
SELECT
    mem.firstname,
    mem.surname,
    rec.firstname AS recommender_firstname,
    rec.surname AS recommender_surname
FROM cd.members mem
LEFT JOIN cd.members rec ON mem.recommendedby = rec.memid
ORDER BY mem.surname, mem.firstname;

-- 5. Produce a list of all members who have used a tennis court
SELECT DISTINCT
    mem.firstname || ' ' || mem.surname AS member,
    fac.name AS facility
FROM cd.members mem
JOIN cd.bookings bks ON mem.memid = bks.memid
JOIN cd.facilities fac ON bks.facid = fac.facid
WHERE fac.name LIKE 'Tennis Court%'
ORDER BY member, facility;

-- 6. Produce a list of costly bookings
SELECT
    fac.name AS facility,
    mem.firstname || ' ' || mem.surname AS member,
    CASE
        WHEN mem.memid = 0 THEN bks.slots * fac.guestcost
        ELSE bks.slots * fac.membercost
    END AS cost
FROM cd.members mem
JOIN cd.bookings bks ON mem.memid = bks.memid
JOIN cd.facilities fac ON bks.facid = fac.facid
WHERE bks.starttime >= '2012-09-14'
AND bks.starttime < '2012-09-15'
AND CASE
        WHEN mem.memid = 0 THEN bks.slots * fac.guestcost
        ELSE bks.slots * fac.membercost
    END > 30
ORDER BY cost DESC;

-- 7. Produce a list of all members, along with their recommender, using no joins
SELECT DISTINCT
    mem.firstname || ' ' || mem.surname AS member,
    (
        SELECT rec.firstname || ' ' || rec.surname
        FROM cd.members rec
        WHERE rec.memid = mem.recommendedby
    ) AS recommender
FROM cd.members mem
ORDER BY member;

-- 8. Produce a list of costly bookings, using a subquery
SELECT
    facility,
    member,
    cost
FROM (
    SELECT
        fac.name AS facility,
        mem.firstname || ' ' || mem.surname AS member,
        CASE
            WHEN mem.memid = 0 THEN bks.slots * fac.guestcost
            ELSE bks.slots * fac.membercost
        END AS cost
    FROM cd.members mem
    JOIN cd.bookings bks ON mem.memid = bks.memid
    JOIN cd.facilities fac ON bks.facid = fac.facid
    WHERE bks.starttime >= '2012-09-14'
    AND bks.starttime < '2012-09-15'
) AS bookings_with_cost
WHERE cost > 30
ORDER BY cost DESC;