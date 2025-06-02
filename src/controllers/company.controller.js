import Company from "../models/company.model.js"

export async function createCompany(req, res) {

    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({error: 'CUIT already exists'});
        }
        res.status(500).json({error: error.message});
    }
}

export async function getCompanies(req, res) {

    try {
        const companies = await Company.findAll();
        res.json(companies);
    } catch (error) {
        res.status(500).json({error: error.message});
    }

}

