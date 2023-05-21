{{
    config(
        materialized='incremental'
    )
}}

WITH source AS (
    SELECT * FROM {{ source('asana', 'asana_projects_raw') }}
    {% if is_incremental() %}
    WHERE updated_at > (SELECT max(project_modified_at) FROM {{ this }})
    {% endif %}
),

members_agg AS (
    {% if target.name == 'prod' %}
        {{ extract_repeated_record_values('members', 'source', 'member_id') }}
    {% else %}
        {{ extract_jsonb_external_resource('members', 'source', 'member_id') }}
    {% endif %}
),

is_current_calculation AS (
    {{ is_current_calculation('source') }}
),

parsed AS (
    SELECT
    {% if target.name == 'prod' %}
        CAST(s.info.gid AS BIGNUMERIC) AS project_id,
        s.info.archived AS project_is_archived,
        s.info.completed AS project_is_completed,
        s.info.completed_at AS project_completed_at,
        s.info.created_at AS project_created_at,
        s.info.modified_at AS project_modified_at,
        s.info.name AS project_name,
    {% else %}
        (s.info::jsonb ->> 'gid')::bigint AS project_id,
        (s.info::jsonb ->> 'archived')::boolean AS project_is_archived,
        (s.info::jsonb ->> 'completed')::boolean AS project_is_completed,
        (s.info::jsonb ->> 'completed_at')::timestamp AS project_completed_at,
        (s.info::jsonb ->> 'created_at')::timestamp AS project_created_at,
        (s.info::jsonb ->> 'modified_at')::timestamp AS project_modified_at,
        s.info::jsonb ->> 'name' AS project_name,
    {% endif %}
        s2.is_current AS is_current,
        array_agg(s3.member_id) AS project_members
    FROM source AS s
    INNER JOIN
        is_current_calculation AS s2
        USING(id, updated_at)
    INNER JOIN
        members_agg AS s3
        USING(id, updated_at)
    {{ dbt_utils.group_by(n=8) }}
)

SELECT * FROM parsed
