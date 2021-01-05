import { Pool } from 'mysql';
import q from 'q';

export const asyncQuery = async (db: Pool, sql: string, values: any[]): Promise<any> => {
   const deferred = q.defer<any>();

   console.log(sql, values)
   db.query(
      sql,
      values,
      (err, results, _fields) => {
         if (err) {
            deferred.reject(err);
         } else {
            deferred.resolve(results);
         }
      }
   )

   return deferred.promise;
}