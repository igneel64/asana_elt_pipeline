WITH tasks AS (
    SELECT * FROM {{ ref('stg_asana__tasks_current') }}
),

users AS (
    SELECT * FROM {{ ref('asana_users_source') }}
),

date_dim AS (
    SELECT * FROM {{ ref('date_dim') }}
)

SELECT
    count(distinct tsk.task_id) AS task_count,
    coalesce(aus.user_name, 'Unassigned') AS assignee,
    DATETIME_TRUNC(dd.date_day, MONTH) AS year_month
FROM tasks AS tsk
INNER JOIN
   date_dim AS dd
    ON
        (
            dd.date_day < CAST(tsk.task_completed_at AS DATETIME)
            AND dd.date_day > CAST(tsk.task_created_at AS DATETIME)
            AND tsk.task_is_completed = true
        )
        OR (
            tsk.task_is_completed = false
            AND dd.date_day > CAST(tsk.task_created_at AS DATETIME)
        )
LEFT JOIN
    users AS aus
    ON aus.user_id = tsk.task_assignee_id
WHERE datetime_trunc(dd.date_day, MONTH) <= CURRENT_DATETIME()
GROUP BY 2, 3
ORDER BY 3 ASC