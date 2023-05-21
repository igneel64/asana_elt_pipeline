# dbt-asana (PostgreSQL)

A dbt project which transforms data loaded from the [Asana API](https://developers.asana.com/docs/overview) using a custom Node.js loader (_coming soon_).

## Dev environment steps
1. Create a virtual environment `python3 -m venv .dbtenv`
2. Activate it `source .dbtenv/bin/activate`
3. Install required packages from requirements.txt `pip install -r requirements.txt`

_Note: sqlfluff [does not yet](https://github.com/sqlfluff/sqlfluff/issues/4786) support dbt 1.5.0 _

## Project steps
1. Fill the variables required at [profiles.yml](./profiles.yml) and [dbt_project.yml](./dbt_project.yml)
2. `dbt deps`
3. Good to go

## Sample data
In the [sample_data](./sample_data/) folder you can find a SQL file which creates the source database and some sample data which you can use to play around.