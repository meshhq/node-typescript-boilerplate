If you encounter an error while running tests like this: 
```
  "before all" hook
  0 passing (2s)
  1 failing
```
check `ormconfig` to confirm which DB is being used
If postgres, get rid of: 
`await Redis.flushRedis()` from `before(async function()` in `config.test.ts` file

#### General postgres tips:

- Check if postgress is installed `which postgres`

- To start postgresql shell :
`psql` from root 
once in psql shell, type `\l` to view DBs and `\h` for help

Refer to this doc if you need the role set up, create db, or have to deal with permissions :
https://www.postgresql.org/docs/9.2/static/app-psql.html

If you encounter error :
```
  "before all" hook
  0 passing (35ms)
  1 failing
  1)  "before all" hook:
     Error: connect ECONNREFUSED 127.0.0.1:5432
```
... you need to be running the DB in the background to establish server connection:
`brew services start postgresql`