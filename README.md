# Block 33 - ACME HR Directory
Used curl tool in the terminal to test. The following below are what I used to test my code...

## GET /api/employees 
`curl localhost:3000/api/employees`

This command returns an array of employees. 
```
[{"id":1,"name":"Jay","created_at":"2024-03-01T07:27:50.181Z","updated_at":"2024-03-01T07:27:50.181Z","departments_id":1},
{"id":3,"name":"John","created_at":"2024-03-01T07:27:50.181Z","updated_at":"2024-03-01T07:27:50.181Z","departments_id":2},
{"id":4,"name":"Jacob","created_at":"2024-03-01T07:27:50.181Z","updated_at":"2024-03-01T07:27:50.181Z","departments_id":3},
{"id":5,"name":"Jennifer","created_at":"2024-03-01T07:27:50.181Z","updated_at":"2024-03-01T07:27:50.181Z","departments_id":3},
{"id":2,"name":"Jess","created_at":"2024-03-01T07:27:50.181Z","updated_at":"2024-03-01T07:30:32.921Z","departments_id":2}]
```

## GET /api/departments 
`curl localhost:3000/api/departments`

This command returns an array of departments.
```
[{"id":1,"name":"IT"},
{"id":2,"name":"Finance"},
{"id":3,"name":"Shipping"}]
```

## POST /api/employees 
`curl localhost:3000/api/employees -X POST -d '{"name": "Kevin", "departments_id": 1}' -H "Content-Type:application/json"`

This command creates an employee and returns the created employee.
```
{"id":6,"name":"Kevin","created_at":"2024-03-01T07:25:57.681Z","updated_at":"2024-03-01T07:25:57.681Z","departments_id":1}
```

## PUT /api/employees/:id 
`curl localhost:3000/api/employees/2 -X PUT -d '{"name": "Jess", "departments_id": 3}' -H "Content-Type:application/json"`

This command updates an employee and returns the updated employee.
```
{"id":2,"name":"Jess","created_at":"2024-03-01T07:27:50.181Z","updated_at":"2024-03-01T07:30:32.921Z","departments_id":3}
```

## DELETE /api/employees/:id 
`curl -X DELETE localhost:3000/api/employees/1`

This command deletes an employee based on their employee id and returns nothing.
