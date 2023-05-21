WITH tasks AS (
    SELECT * FROM {{ ref('stg_asana__tasks_current') }}
),

users AS (
    SELECT * FROM {{ ref('asana_users_source') }}
)

SELECT
    us.user_name,
    count(*) AS task_count
FROM tasks AS tsk
INNER JOIN
    users AS us
    ON us.user_id = ts.task_assignee_id
GROUP BY 1
ORDER BY 2 DESC