{{
    config(
        materialized='incremental'
    )
}}

WITH source AS (
    SELECT * FROM {{ source('asana', 'asana_tasks_raw') }}
    {% if is_incremental() %}
    WHERE updated_at > (SELECT max(task_modified_at) FROM {{ this }})
    {% endif %}
),

projects_agg AS (
    {% if target.name == 'prod' %}
        {{ extract_repeated_record_values('projects', 'source', 'project_id') }}
    {% else %}
        {{ extract_jsonb_external_resource('projects', 'source', 'project_id') }}
    {% endif %}
),

is_current_calculation AS (
    {{ is_current_calculation('source') }}
),

parsed AS (
    SELECT -- noqa: ST06
    {% if target.name == 'prod' %}
        CAST(s.info.gid AS BIGNUMERIC) AS task_id,
        s.info.due_at AS task_due_at,
        s.info.due_on AS task_due_on,
        s.info.completed AS task_is_completed,
        s.info.completed_at AS task_completed_at,
        s.info.created_at AS task_created_at,
        s.info.modified_at AS task_modified_at,
        CAST(s.info.assignee.gid AS BIGNUMERIC) AS task_assignee_id,
        s.info.assignee_status AS task_assignee_status,
        s.info.name AS task_name,
        timestamp_diff(info.completed_at, info.created_at, DAY) AS task_creation_to_completion_days,
    {% else %}
        (s.info::jsonb ->> 'gid')::bigint AS task_id,
        (s.info::jsonb ->> 'due_at')::timestamp AS task_due_at,
        (s.info::jsonb ->> 'due_on')::timestamp AS task_due_on,
        (s.info::jsonb ->> 'completed')::boolean AS task_is_completed,
        (s.info::jsonb ->> 'completed_at')::timestamp AS task_completed_at,
        (s.info::jsonb ->> 'created_at')::timestamp AS task_created_at,
        (s.info::jsonb ->> 'modified_at')::timestamp AS task_modified_at,
        (
            (s.info::jsonb ->> 'assignee')::jsonb ->> 'gid'
        )::bigint AS task_assignee_id,
        s.info::jsonb ->> 'assignee_status' AS task_assignee_status,
        s.info::jsonb ->> 'name' AS task_name,
        date_part(
            'day',
            (s.info::jsonb ->> 'completed_at')::timestamp
            - (s.info::jsonb ->> 'created_at')::timestamp
        ) AS task_creation_to_completion_days,  
    {% endif %}
        s2.is_current AS is_current,
        array_agg(s3.project_id) AS task_projects
    FROM source AS s
    INNER JOIN
        is_current_calculation AS s2
        USING(id, updated_at)
    INNER JOIN
        projects_agg AS s3
        USING(id, updated_at)
    {{ dbt_utils.group_by(n=12) }}
)

SELECT * FROM parsed
