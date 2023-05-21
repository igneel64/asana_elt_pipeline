{# Test referential integrity in a nested resource. #}
{% test relationship_in_array(model, column_name, field, to) %}

with child as (
    select unnest({{ column_name }}) as from_field
    from {{ model }}
),

parent as (
    select {{ field }} as to_field
    from {{ to }}
)

select from_field
from child
left join parent 
    on child.from_field = parent.to_field
where parent.to_field is null

{% endtest %}