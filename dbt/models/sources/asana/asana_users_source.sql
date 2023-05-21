WITH source AS (
    SELECT * FROM {{ source('asana', 'asana_users_raw') }}
),

parsed AS (
    SELECT
    {% if target.name == 'prod' %}
        CAST(info.gid AS BIGNUMERIC) AS user_id,
        info.name AS user_name,
        info.email AS user_email
    {% else %}
        (info::jsonb ->> 'gid')::bigint AS user_id,
        info::jsonb ->> 'name' AS user_name,
        info::jsonb ->> 'email' AS user_email
    {% endif %}
    FROM source
)

SELECT * FROM parsed
