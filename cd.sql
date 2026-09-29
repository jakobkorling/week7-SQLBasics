-- 1 Retrieve everything for a table
select * from cd.facilities;  

-- 2 Retrieve specific column
select name, memerbocst from cd.facilities;

-- 3 Retrieve list of facilities that charge member fee
select * from cd.facilities where membercost > 0; 

-- 4 Retrieve a list of facilities that charge a fee to members, and that fee is less than 1/50th of the monthly maintenance cost
select facid, name, membercost, monthlymaintenance 
	from cd.facilities 
	where 
		membercost > 0 and 
		(membercost < monthlymaintenance/50.0); 

-- 5 Retrieve list of name "Tennis"
select *
	from cd.facilities 
	where 
		name like '%Tennis%';   

-- 6 Retrieve details of ID 1 and 5
select * 
    from cd.facilities
    where
        facid in (1,5);

-- 7 Retrieve 
select name, 
	case when (monthlymaintenance > 100) then
		'expensive'
	else
		'cheap'
	end as cost
	from cd.facilities;  

-- 8 Members who joined after sep 2012
select memid, surname, firstname, joindate 
	from cd.members
	where joindate >= '2012-09-01'; 

-- 9 List of first 10 surnames
select distinct surname 
	from cd.members
order by surname
limit 10;   

-- 10 list of all surnames and facility names
select surname 
	from cd.members
union
select name
	from cd.facilities;        

-- 11 Signup date of last member
select max(joindate) as latest
	from cd.members;   

-- 12 First and last name of the last member
select firstname, surname, joindate
	from cd.members
	where joindate = 
		(select max(joindate) 
			from cd.members);