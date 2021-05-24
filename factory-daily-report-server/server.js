const express = require("express");
const { port } = require("./src/utils/variables");
const { mongoClient } = require("./src/utils/database");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const teamRolesRoutes = require("./src/routes/teams/teamRoles");
const teamSectionsRoutes = require("./src/routes/teams/teamSections");
const teamsRoutes = require("./src/routes/teams/teams");
const suppliersRoutes = require("./src/routes/parts/suppliers");
const fieldsRoutes = require("./src/routes/fields/fields");
const equipmentsRoutes = require("./src/routes/equipments/equipments");
const sparePartsRoutes = require("./src/routes/parts/parts");
const reportsRoutes = require("./src/routes/reports/reports");
const logsRoutes = require("./src/routes/logs/logs");
const technicianReportsRoutes = require("./src/routes/reports/technicianReports");
const userRoutes = require("./src/routes/user/user");

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8080", "http://192.168.1.106:8080"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/teamRoles", teamRolesRoutes);
app.use("/teamSections", teamSectionsRoutes);
app.use("/teams", teamsRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/fields", fieldsRoutes);
app.use("/equipments", equipmentsRoutes);
app.use("/sparePart", sparePartsRoutes);
app.use("/reports", reportsRoutes);
app.use("/logs", logsRoutes);
app.use("/technician-reports", technicianReportsRoutes);
app.use("/user", userRoutes);

mongoClient(() => {
  app.listen(port);
});
