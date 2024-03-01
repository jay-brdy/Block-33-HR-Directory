// imports here for express and pg
const express = require('express')
const app = express()
const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directories_db')

//app routes here
app.use(express.json());
app.use(require('morgan')('dev'));

//returns array of departments
app.get('/api/departments', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * from departments
        `
        const result = await client.query(SQL)
        res.send(result.rows)

    } catch (error) {
        next(error)
    }
});

//returns array of employees sorted by created_at
app.get('/api/employees', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * from employees ORDER BY created_at DESC;
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
});

//create employees, returns the created employee
app.post('/api/employees', async (req, res, next) => {
    try {
        const SQL = `
        INSERT INTO employees(name, department_id)
        VALUES($1, $2)
        RETURNING *
      `
        const response = await client.query(SQL, [req.body.name, req.body.department_id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
});

// update employees, returns the updated employee
app.put('/api/employees/:id', async (req, res, next) => {
    try {
        const SQL = `
        UPDATE employees
        SET name=$1, department_id=$2, updated_at= now()
        WHERE id=$3 RETURNING *
      `
        const response = await client.query(SQL, [
            req.body.name,
            req.body.department_id,
            req.params.id
        ])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
});

// delete employee, returns nothing
app.delete('/api/employees/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE from employees
        WHERE id = $1
      `
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
});

//create init function
const init = async () => {
    await client.connect();
    console.log('connected to database')
    let SQL = `
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
        
        CREATE TABLE departments(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
        );

        CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        departments_id INTEGER REFERENCES departments(id) NOT NULL
        );
    `
    await client.query(SQL)
    console.log('tables created')
    SQL = `
        INSERT INTO departments(name) VALUES('Finance');
        INSERT INTO departments(name) VALUES('IT');
        INSERT INTO departments(name) VALUES('Shipping');
        INSERT INTO employees(name, departments_id) VALUES('Jay', (SELECT id FROM departments WHERE name='IT'));
        INSERT INTO employees(name, departments_id) VALUES('Jessica', (SELECT id FROM departments WHERE name='Finance'));
        INSERT INTO employees(name, departments_id) VALUES('John', (SELECT id FROM departments WHERE name='Finance'));
        INSERT INTO employees(name, departments_id) VALUES('Jacob', (SELECT id FROM departments WHERE name='Shipping'));
        INSERT INTO employees(name, departments_id) VALUES('Jennifer', (SELECT id FROM departments WHERE name='Shipping'));
        `;
    await client.query(SQL);
    console.log('data seeded');

    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
}

// invoke init function
init()