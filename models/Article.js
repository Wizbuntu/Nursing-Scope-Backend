// require sequelize 
const { sequelize } = require('../config/db.config')
const { DataTypes } = require('sequelize')

// sequelize paginate
const sequelizePaginate = require('sequelize-paginate')

// init Articles Model 
const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abstract: {
        type: DataTypes.TEXT,

    },
    keywords: {
        type: DataTypes.STRING
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    citation: {
        type: DataTypes.TEXT
    },
    startPage: {
        type: DataTypes.TEXT
    },
    endPage: {
        type: DataTypes.TEXT
    },
    affiliation: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        allowNull: false
    },
    article_image: {
        type: DataTypes.STRING,

    },
    article_file_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publishedDate: {
        type: DataTypes.STRING,
    },
    updatedDate: {
        type: DataTypes.STRING,
    }



}, { timestamps: true })

sequelizePaginate.paginate(Article)

// export Model
module.exports = Article