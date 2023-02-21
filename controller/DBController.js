
/*
{
  "born_date": "",
  "civil_state": "",
  "gender": "Masculin",
  "income": [
    { "check_box_content": "salariu", "check_box_value": false },
    {
      "check_box_content": "activitatea individuală agricolă, gospodăria auxiliară",
      "check_box_value": false
    },
    {
      "check_box_content": "activitatea individuală non-agricolă (afacere proprie)",
      "check_box_value": false
    },
    { "check_box_content": "pensie", "check_box_value": false },
    {
      "check_box_content": "pensie de dizabilitate (invaliditate)",
      "check_box_value": false
    },
    { "check_box_content": "ajutor de şomaj", "check_box_value": false },
    {
      "check_box_content": "alte plăţi sociale (alocaţii sociale, compensaţii, indemnizaţii, ajutor social etc.)",
      "check_box_value": false
    },
    { "check_box_content": "X burse", "check_box_value": false },
    {
      "check_box_content": "transferuri din afara ţării",
      "check_box_value": false
    },
    {
      "check_box_content": "venituri din proprietate",
      "check_box_value": false
    },
    {
      "check_box_content": "altă sursă de venit",
      "check_box_value": false
    },
    {
      "check_box_content": "la întreţinerea instituţiilor de stat",
      "check_box_value": false
    },
    {
      "check_box_content": "la întreţinerea altor persoane",
      "check_box_value": false
    }
  ],
  "last_name": "Tudor",
  "name": "Popescu",
  "nationality": "Moldovean",
  "native_language": "Romana"
}
*/

const db = require("../db")
const json = require('json')
const path = require('path')

const localPath = __dirname

const civilStateMap = new Map()
civilStateMap.set('Necăsătorit(ă)', 1)
civilStateMap.set('Casătorit(ă)', 2)
civilStateMap.set('Văduv(ă)', 3)
civilStateMap.set('Divorțat(ă)', 4)


class DBController{
    index(req, res){
        res.send("<h1 style=\" text-align: center;\">Server working . . . </h1>")
    }
    async answer(req, res){
        const {
            last_name,
            name,
            nationality,
            native_language,
            born_date,
            civil_state,
            gender,
            income,
            nr_children
        } = req.body


        // insert data in table income -> DB
        await db.query(
                `WITH id AS (
                      INSERT INTO income (
                        salariu,
                        activitate_agricola,
                        afacere_proprie,
                        pensie,
                        pensie_invalid,
                        ajutor_somaj,
                        plati_sociale,
                        burse,
                        transferuri_alte_tari,
                        venituri_proprietate,
                        alta_sursa_venit,
                        intretinere_institutii_de_stat,
                        intretinere_alta_persoana
                      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                      RETURNING id_income
                    )
                    INSERT INTO answers (
                      nume,
                      prenume,
                      sex,
                      data_nasterii,
                      starea_civila,
                      nationalitate,
                      limba_materna,
                      id_row_income,
                      num_children
                    )
                    SELECT $14, $15, $16, $17, $18, $19, $20, id_income, $21
                    FROM id;`,
                [
                    income[0].check_box_value,
                    income[1].check_box_value,
                    income[2].check_box_value,
                    income[3].check_box_value,
                    income[4].check_box_value,
                    income[5].check_box_value,
                    income[6].check_box_value,
                    income[7].check_box_value,
                    income[8].check_box_value,
                    income[9].check_box_value,
                    income[10].check_box_value,
                    income[11].check_box_value,
                    income[12].check_box_value,
                    name, last_name, gender, born_date, civilStateMap.get(civil_state), nationality, native_language, nr_children
                ],
                (err) => {
                    if (err){
                        console.log("Answer insert = >" + err)
                        res.status(404).json({
                             "msg" : "Insert Error -> DataBase"
                        })
                    }else{
                        console.log("ZBS")
                        res.json({
                            "msg" : "Succesfull"
                        })
                }
            }
        )

    }
    async gender(req, res){
        await  db.query(
        `WITH count_male as (
        	SELECT COUNT(*) as male FROM ANSWERS WHERE SEX = $1
        ), count_female as (
        	SELECT COUNT(*) as female FROM ANSWERS WHERE SEX = $2
        ), total_people as (
        	SELECT COUNT(*) AS total FROM ANSWERS
        )
        SELECT male, female, total
        FROM count_male
        CROSS JOIN count_female
        CROSS JOIN total_people`,['Masculin', 'Feminin'], (err, result)=>{
            if (err){
                console.log("Error => " + err)
                res.json({
                    error : err
                })
            }else{
                const count_male = parseInt(result.rows[0].male)
                const count_female = parseInt(result.rows[0].female)
                const total_people = parseInt(result.rows[0].total)

                const percentage_male = ((count_male * 100) / total_people).toFixed(2)
                const percentage_female = ((count_female * 100) / total_people).toFixed(2)

                res.json({
                    "count_male" : count_male,
                    "count_female" : count_female,
                    "percentage_male" : percentage_male,
                    "percentage_female" : percentage_female
                })
                console.log({
                    "count_male" : count_male,
                    "count_female" : count_female,
                    "percentage_male" : percentage_male,
                    "percentage_female" : percentage_female
                })
            }
        })
    }
    async ages(req, res){
        await  db.query(
                `SELECT
                  age_groups.age_group,
                  COUNT(answers.data_nasterii) AS count_group
                FROM (
                  SELECT '0-14' AS age_group
                  UNION SELECT '15-59' AS age_group
                  UNION SELECT '60+' AS age_group
                ) age_groups
                LEFT JOIN answers ON CASE
                  WHEN date_part('year', age(answers.data_nasterii)) <= 14 THEN '0-14'
                  WHEN date_part('year', age(answers.data_nasterii)) <= 59 THEN '15-59'
                  ELSE '60+'
                END = age_groups.age_group
                GROUP BY age_groups.age_group
                ORDER BY age_groups.age_group;`,(err, result)=>{
            if (err){
                console.log("Error => " + err)
                res.json({
                    error : err
                })
            }else{
                const count_age_group_0_14 = result.rows[0].count_group
                const count_age_group_15_59 = result.rows[1].count_group
                const count_age_group_60_more = result.rows[2].count_group
                res.json({
                    "count_age_group_0_14" : parseInt(count_age_group_0_14),
                    "count_age_group_15_59" : parseInt(count_age_group_15_59),
                    "count_age_group_60_more" : parseInt(count_age_group_60_more)
                })
                console.log({
                    "count_age_group_0_14" : count_age_group_0_14,
                    "count_age_group_15_59" : count_age_group_15_59,
                    "count_age_group_60_more" : count_age_group_60_more
                })
            }
        })
    }
    async civilState(req, res){
        await db.query(`
        WITH count_unmarried as (
        	SELECT COUNT(*) as unmarried FROM ANSWERS WHERE starea_civila = 1
        ), count_married as (
        	SELECT COUNT(*) as married FROM ANSWERS WHERE starea_civila = 2
        ), count_widower as (
        	SELECT COUNT(*) AS widower FROM ANSWERS WHERE starea_civila = 3
        ), count_divorced as (
        	SELECT COUNT(*) AS divorced FROM ANSWERS WHERE starea_civila = 4
        ), count_total as (
        	SELECT COUNT(*) AS total FROM ANSWERS
        )
        SELECT unmarried, married, widower, divorced, total
        FROM count_unmarried
        CROSS JOIN count_married
        CROSS JOIN count_widower
        CROSS JOIN count_divorced
        CROSS JOIN count_total;
        `, (err, result)=>{
            if(err){
                console.log("Error => " + err)
                res.json({
                    error : err
                })
            }else{
                const total = result.rows[0].total
                const percentage_unmarried = (result.rows[0].unmarried * 100) / total
                const percentage_married = (result.rows[0].married * 100) / total
                const percentage_widower = (result.rows[0].widower * 100) / total
                const percentage_divorced = (result.rows[0].divorced * 100) / total

                console.log(result.rows[0])
                res.json({
                    "percentage_unmarried" : percentage_unmarried.toFixed(2),
                    "percentage_married" : percentage_married.toFixed(2),
                    "percentage_widower" : percentage_widower.toFixed(2),
                    "percentage_divorced" : percentage_divorced.toFixed(2)
                })
            }
        })
    }
    async nationality(req, res){
        await db.query(`
            SELECT
              nationalitate as nationality_label,
              COUNT(*) as nationality_count,
              limba_materna as limba_materna_label,
              COUNT(*) as limba_materna_count
            FROM answers
            GROUP BY nationalitate, limba_materna
            ORDER BY nationality_count DESC;

`, (err, result)=>{
            if(err){
                console.log("Error => " + err)
                res.json({
                    error : err
                })
            }else{
                res.json(result.rows)
                console.log(result.rows)
            }
        })
    }
}


module.exports = new DBController();

/*SELECT
              CASE
                WHEN percentage < 10
                THEN 'Other'
                ELSE nationality
              END AS nationality_category,
              ROUND(CAST(SUM(percentage) AS NUMERIC), 2) AS nationality_percentage,
              CASE
                WHEN percentage2 < 10
                THEN 'Other'
                ELSE limba_materna
              END AS limba_materna_category,
              ROUND(CAST(SUM(percentage2) AS NUMERIC), 2) AS limba_materna_percentage
            FROM (
              SELECT
                nationalitate AS nationality,
                COUNT(*) * 100.0 / (SELECT COUNT(*) FROM answers) AS percentage,
                limba_materna,
                COUNT(*) * 100.0 / (SELECT COUNT(*) FROM answers) AS percentage2
              FROM answers
              GROUP BY nationalitate, limba_materna
            ) subquery
            GROUP BY CASE
              WHEN percentage < 10
              THEN 'Other'
              ELSE nationality
            END, CASE
              WHEN percentage2 < 10
              THEN 'Other'
              ELSE limba_materna
            END
            ORDER BY nationality_percentage DESC, limba_materna_percentage DESC
            LIMIT 10*/