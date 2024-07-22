const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
// const loginRoutes = require('./login');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

app.post("/add", async(req,res) => {
    try {
        const { server_name, location, system_running, internal_address, external_address, reason_for_failure, date_of_failure, date_of_startup, status } = req.body;
        const newServer = await pool.query("INSERT INTO servers (server_name, location, system_running, internal_address, external_address, reason_for_failure, date_of_failure, date_of_startup, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [server_name, location, system_running, internal_address, external_address, reason_for_failure, date_of_failure, date_of_startup, status]
        );
        res.json(newServer.rows[0]);
    } catch (err) {
        console.log(err.message)
    }
})
app.get("/servers", async(req,res) => {
    try {
        const allServers = await pool.query("SELECT * FROM servers");
        res.json(allServers.rows);
    } catch (error) {
        console.error(error.message)
    }
})
app.get("/servers/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const server = await pool.query("SELECT * FROM servers WHERE id = $1",[id]);
        res.json(server.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
})

app.put("/servers/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const { server_name, location, system_running, internal_address, external_address, reason_for_failure, date_of_failure, date_of_startup, status } = req.body;
        const updateServer = await pool.query(
            "UPDATE servers SET server_name = $1, location = $2, system_running = $3, internal_address = $4, external_address = $5, reason_for_failure = $6, date_of_failure = $7, date_of_startup = $8, status = $9 WHERE id = $10 RETURNING *",
            [server_name, location, system_running, internal_address, external_address, reason_for_failure, date_of_failure, date_of_startup, status, id]
        );
        res.json(updateServer.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
})

app.delete("/servers/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteServer = await pool.query("DELETE FROM servers WHERE id = $1 RETURNING *",[id]);
        res.json({ message: "Server deleted successfully", server: deleteServer.rows[0] });
    } catch (error) {
        console.error(error.message)
    }
})
app.put("/servers/date/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { reason_for_failure, date_of_failure, date_of_startup } = req.body;
        const currentServer = await pool.query("SELECT * FROM servers WHERE id = $1", [id]);

        if (currentServer.rows.length > 0) {
            const {server_name: current_server_name, reason_for_failure: current_reason_for_failure, date_of_failure: current_date_of_failure, date_of_startup: current_date_of_startup, status: current_status } = currentServer.rows[0];
            await pool.query(
                "INSERT INTO server_history (server_name, reason_for_failure, date_of_failure, date_of_startup, status) VALUES ($1, $2, $3, $4, $5)",
                [current_server_name, current_reason_for_failure, current_date_of_failure, current_date_of_startup, current_status]
            );

            let newStatus = current_status;
            if (date_of_failure && date_of_startup) {
                newStatus = new Date(date_of_failure) > new Date(date_of_startup) ? "inActive" : "Active";
            }

            const updateServer = await pool.query(
                "UPDATE servers SET reason_for_failure = $1, date_of_failure = $2, date_of_startup = $3, status = $4 WHERE id = $5 RETURNING *",
                [reason_for_failure, date_of_failure, date_of_startup, newStatus, id]
            );

            res.json(updateServer.rows[0]);
        } else {
            res.status(404).json({ message: "Server not found" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

app.get("/history/servers", async(req, res) => {
    try {
        const history = await pool.query("SELECT * FROM server_history");
        res.json(history.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});



app.post('/login', async (req, res) => {
    const loginData = req.body.loginData;
    const { username, password } = req.body.loginData;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (user) {
            if(user.userName === loginData.userName && user.password === loginData.password){
                const token = jwt.sign({ username: user.username, role: user.role }, 'secret', { expiresIn: '300s' });
                return res.status(200).send({ token });
            } else {
                console.log('Password mismatch');
                return res.status(401).send({ error: 'Invalid username or password' });
            }
        } else {
            console.log('User not found');
            return res.status(401).send({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send({ error: 'Server error' });
    }
});






app.listen(5000, () => {
    console.log("server 5000 port deer ajillaj baina");
});