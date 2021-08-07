// require sequelize 
const { sequelize } = require('../config/db.config')
const { DataTypes } = require('sequelize')



// init Volume Model 
const Volume = sequelize.define('Volume', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    issue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, { timestamps: true })


// export Model
module.exports = Volume