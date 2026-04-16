
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Case
 * 
 */
export type Case = $Result.DefaultSelection<Prisma.$CasePayload>
/**
 * Model JournalEntry
 * 
 */
export type JournalEntry = $Result.DefaultSelection<Prisma.$JournalEntryPayload>
/**
 * Model CaseActivity
 * 
 */
export type CaseActivity = $Result.DefaultSelection<Prisma.$CaseActivityPayload>
/**
 * Model CdrRequest
 * 
 */
export type CdrRequest = $Result.DefaultSelection<Prisma.$CdrRequestPayload>
/**
 * Model InternationalRequest
 * 
 */
export type InternationalRequest = $Result.DefaultSelection<Prisma.$InternationalRequestPayload>
/**
 * Model ActivityReport
 * 
 */
export type ActivityReport = $Result.DefaultSelection<Prisma.$ActivityReportPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.case`: Exposes CRUD operations for the **Case** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cases
    * const cases = await prisma.case.findMany()
    * ```
    */
  get case(): Prisma.CaseDelegate<ExtArgs>;

  /**
   * `prisma.journalEntry`: Exposes CRUD operations for the **JournalEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JournalEntries
    * const journalEntries = await prisma.journalEntry.findMany()
    * ```
    */
  get journalEntry(): Prisma.JournalEntryDelegate<ExtArgs>;

  /**
   * `prisma.caseActivity`: Exposes CRUD operations for the **CaseActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseActivities
    * const caseActivities = await prisma.caseActivity.findMany()
    * ```
    */
  get caseActivity(): Prisma.CaseActivityDelegate<ExtArgs>;

  /**
   * `prisma.cdrRequest`: Exposes CRUD operations for the **CdrRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CdrRequests
    * const cdrRequests = await prisma.cdrRequest.findMany()
    * ```
    */
  get cdrRequest(): Prisma.CdrRequestDelegate<ExtArgs>;

  /**
   * `prisma.internationalRequest`: Exposes CRUD operations for the **InternationalRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InternationalRequests
    * const internationalRequests = await prisma.internationalRequest.findMany()
    * ```
    */
  get internationalRequest(): Prisma.InternationalRequestDelegate<ExtArgs>;

  /**
   * `prisma.activityReport`: Exposes CRUD operations for the **ActivityReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActivityReports
    * const activityReports = await prisma.activityReport.findMany()
    * ```
    */
  get activityReport(): Prisma.ActivityReportDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Case: 'Case',
    JournalEntry: 'JournalEntry',
    CaseActivity: 'CaseActivity',
    CdrRequest: 'CdrRequest',
    InternationalRequest: 'InternationalRequest',
    ActivityReport: 'ActivityReport'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "case" | "journalEntry" | "caseActivity" | "cdrRequest" | "internationalRequest" | "activityReport"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Case: {
        payload: Prisma.$CasePayload<ExtArgs>
        fields: Prisma.CaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findFirst: {
            args: Prisma.CaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findMany: {
            args: Prisma.CaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          create: {
            args: Prisma.CaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          createMany: {
            args: Prisma.CaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          delete: {
            args: Prisma.CaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          update: {
            args: Prisma.CaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          deleteMany: {
            args: Prisma.CaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          aggregate: {
            args: Prisma.CaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCase>
          }
          groupBy: {
            args: Prisma.CaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseCountArgs<ExtArgs>
            result: $Utils.Optional<CaseCountAggregateOutputType> | number
          }
        }
      }
      JournalEntry: {
        payload: Prisma.$JournalEntryPayload<ExtArgs>
        fields: Prisma.JournalEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JournalEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JournalEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          findFirst: {
            args: Prisma.JournalEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JournalEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          findMany: {
            args: Prisma.JournalEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          create: {
            args: Prisma.JournalEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          createMany: {
            args: Prisma.JournalEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JournalEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          delete: {
            args: Prisma.JournalEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          update: {
            args: Prisma.JournalEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          deleteMany: {
            args: Prisma.JournalEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JournalEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JournalEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          aggregate: {
            args: Prisma.JournalEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJournalEntry>
          }
          groupBy: {
            args: Prisma.JournalEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<JournalEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.JournalEntryCountArgs<ExtArgs>
            result: $Utils.Optional<JournalEntryCountAggregateOutputType> | number
          }
        }
      }
      CaseActivity: {
        payload: Prisma.$CaseActivityPayload<ExtArgs>
        fields: Prisma.CaseActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          findFirst: {
            args: Prisma.CaseActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          findMany: {
            args: Prisma.CaseActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>[]
          }
          create: {
            args: Prisma.CaseActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          createMany: {
            args: Prisma.CaseActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>[]
          }
          delete: {
            args: Prisma.CaseActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          update: {
            args: Prisma.CaseActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          deleteMany: {
            args: Prisma.CaseActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CaseActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          aggregate: {
            args: Prisma.CaseActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseActivity>
          }
          groupBy: {
            args: Prisma.CaseActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseActivityCountArgs<ExtArgs>
            result: $Utils.Optional<CaseActivityCountAggregateOutputType> | number
          }
        }
      }
      CdrRequest: {
        payload: Prisma.$CdrRequestPayload<ExtArgs>
        fields: Prisma.CdrRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CdrRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CdrRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>
          }
          findFirst: {
            args: Prisma.CdrRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CdrRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>
          }
          findMany: {
            args: Prisma.CdrRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>[]
          }
          create: {
            args: Prisma.CdrRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>
          }
          createMany: {
            args: Prisma.CdrRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CdrRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>[]
          }
          delete: {
            args: Prisma.CdrRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>
          }
          update: {
            args: Prisma.CdrRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>
          }
          deleteMany: {
            args: Prisma.CdrRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CdrRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CdrRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CdrRequestPayload>
          }
          aggregate: {
            args: Prisma.CdrRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCdrRequest>
          }
          groupBy: {
            args: Prisma.CdrRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<CdrRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.CdrRequestCountArgs<ExtArgs>
            result: $Utils.Optional<CdrRequestCountAggregateOutputType> | number
          }
        }
      }
      InternationalRequest: {
        payload: Prisma.$InternationalRequestPayload<ExtArgs>
        fields: Prisma.InternationalRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InternationalRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InternationalRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>
          }
          findFirst: {
            args: Prisma.InternationalRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InternationalRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>
          }
          findMany: {
            args: Prisma.InternationalRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>[]
          }
          create: {
            args: Prisma.InternationalRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>
          }
          createMany: {
            args: Prisma.InternationalRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InternationalRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>[]
          }
          delete: {
            args: Prisma.InternationalRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>
          }
          update: {
            args: Prisma.InternationalRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>
          }
          deleteMany: {
            args: Prisma.InternationalRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InternationalRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InternationalRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternationalRequestPayload>
          }
          aggregate: {
            args: Prisma.InternationalRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInternationalRequest>
          }
          groupBy: {
            args: Prisma.InternationalRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<InternationalRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.InternationalRequestCountArgs<ExtArgs>
            result: $Utils.Optional<InternationalRequestCountAggregateOutputType> | number
          }
        }
      }
      ActivityReport: {
        payload: Prisma.$ActivityReportPayload<ExtArgs>
        fields: Prisma.ActivityReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActivityReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActivityReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>
          }
          findFirst: {
            args: Prisma.ActivityReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActivityReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>
          }
          findMany: {
            args: Prisma.ActivityReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>[]
          }
          create: {
            args: Prisma.ActivityReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>
          }
          createMany: {
            args: Prisma.ActivityReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActivityReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>[]
          }
          delete: {
            args: Prisma.ActivityReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>
          }
          update: {
            args: Prisma.ActivityReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>
          }
          deleteMany: {
            args: Prisma.ActivityReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActivityReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActivityReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityReportPayload>
          }
          aggregate: {
            args: Prisma.ActivityReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivityReport>
          }
          groupBy: {
            args: Prisma.ActivityReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivityReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActivityReportCountArgs<ExtArgs>
            result: $Utils.Optional<ActivityReportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    cases: number
    entries: number
    cdrRequests: number
    internationalRequests: number
    activityReports: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | UserCountOutputTypeCountCasesArgs
    entries?: boolean | UserCountOutputTypeCountEntriesArgs
    cdrRequests?: boolean | UserCountOutputTypeCountCdrRequestsArgs
    internationalRequests?: boolean | UserCountOutputTypeCountInternationalRequestsArgs
    activityReports?: boolean | UserCountOutputTypeCountActivityReportsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCdrRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CdrRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInternationalRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InternationalRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivityReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityReportWhereInput
  }


  /**
   * Count Type CaseCountOutputType
   */

  export type CaseCountOutputType = {
    entries: number
    cdrRequests: number
    internationalRequests: number
    caseActivities: number
  }

  export type CaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | CaseCountOutputTypeCountEntriesArgs
    cdrRequests?: boolean | CaseCountOutputTypeCountCdrRequestsArgs
    internationalRequests?: boolean | CaseCountOutputTypeCountInternationalRequestsArgs
    caseActivities?: boolean | CaseCountOutputTypeCountCaseActivitiesArgs
  }

  // Custom InputTypes
  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseCountOutputType
     */
    select?: CaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountCdrRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CdrRequestWhereInput
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountInternationalRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InternationalRequestWhereInput
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountCaseActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseActivityWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    approved: boolean | null
    deactivated: boolean | null
    cdrAccess: boolean | null
    lastActive: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    approved: boolean | null
    deactivated: boolean | null
    cdrAccess: boolean | null
    lastActive: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    approved: number
    deactivated: number
    cdrAccess: number
    lastActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    approved?: true
    deactivated?: true
    cdrAccess?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    approved?: true
    deactivated?: true
    cdrAccess?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    approved?: true
    deactivated?: true
    cdrAccess?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: string
    approved: boolean
    deactivated: boolean
    cdrAccess: boolean
    lastActive: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cases?: boolean | User$casesArgs<ExtArgs>
    entries?: boolean | User$entriesArgs<ExtArgs>
    cdrRequests?: boolean | User$cdrRequestsArgs<ExtArgs>
    internationalRequests?: boolean | User$internationalRequestsArgs<ExtArgs>
    activityReports?: boolean | User$activityReportsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | User$casesArgs<ExtArgs>
    entries?: boolean | User$entriesArgs<ExtArgs>
    cdrRequests?: boolean | User$cdrRequestsArgs<ExtArgs>
    internationalRequests?: boolean | User$internationalRequestsArgs<ExtArgs>
    activityReports?: boolean | User$activityReportsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      cases: Prisma.$CasePayload<ExtArgs>[]
      entries: Prisma.$JournalEntryPayload<ExtArgs>[]
      cdrRequests: Prisma.$CdrRequestPayload<ExtArgs>[]
      internationalRequests: Prisma.$InternationalRequestPayload<ExtArgs>[]
      activityReports: Prisma.$ActivityReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: string
      approved: boolean
      deactivated: boolean
      cdrAccess: boolean
      lastActive: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cases<T extends User$casesArgs<ExtArgs> = {}>(args?: Subset<T, User$casesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany"> | Null>
    entries<T extends User$entriesArgs<ExtArgs> = {}>(args?: Subset<T, User$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany"> | Null>
    cdrRequests<T extends User$cdrRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$cdrRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findMany"> | Null>
    internationalRequests<T extends User$internationalRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$internationalRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findMany"> | Null>
    activityReports<T extends User$activityReportsArgs<ExtArgs> = {}>(args?: Subset<T, User$activityReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly approved: FieldRef<"User", 'Boolean'>
    readonly deactivated: FieldRef<"User", 'Boolean'>
    readonly cdrAccess: FieldRef<"User", 'Boolean'>
    readonly lastActive: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.cases
   */
  export type User$casesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    cursor?: CaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * User.entries
   */
  export type User$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    cursor?: JournalEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * User.cdrRequests
   */
  export type User$cdrRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    where?: CdrRequestWhereInput
    orderBy?: CdrRequestOrderByWithRelationInput | CdrRequestOrderByWithRelationInput[]
    cursor?: CdrRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CdrRequestScalarFieldEnum | CdrRequestScalarFieldEnum[]
  }

  /**
   * User.internationalRequests
   */
  export type User$internationalRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    where?: InternationalRequestWhereInput
    orderBy?: InternationalRequestOrderByWithRelationInput | InternationalRequestOrderByWithRelationInput[]
    cursor?: InternationalRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InternationalRequestScalarFieldEnum | InternationalRequestScalarFieldEnum[]
  }

  /**
   * User.activityReports
   */
  export type User$activityReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    where?: ActivityReportWhereInput
    orderBy?: ActivityReportOrderByWithRelationInput | ActivityReportOrderByWithRelationInput[]
    cursor?: ActivityReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActivityReportScalarFieldEnum | ActivityReportScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Case
   */

  export type AggregateCase = {
    _count: CaseCountAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  export type CaseMinAggregateOutputType = {
    id: string | null
    caseNumber: string | null
    title: string | null
    category: string | null
    status: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    closedAt: Date | null
    closureReason: string | null
    officerId: string | null
  }

  export type CaseMaxAggregateOutputType = {
    id: string | null
    caseNumber: string | null
    title: string | null
    category: string | null
    status: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    closedAt: Date | null
    closureReason: string | null
    officerId: string | null
  }

  export type CaseCountAggregateOutputType = {
    id: number
    caseNumber: number
    title: number
    category: number
    status: number
    description: number
    createdAt: number
    updatedAt: number
    closedAt: number
    closureReason: number
    officerId: number
    _all: number
  }


  export type CaseMinAggregateInputType = {
    id?: true
    caseNumber?: true
    title?: true
    category?: true
    status?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    closedAt?: true
    closureReason?: true
    officerId?: true
  }

  export type CaseMaxAggregateInputType = {
    id?: true
    caseNumber?: true
    title?: true
    category?: true
    status?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    closedAt?: true
    closureReason?: true
    officerId?: true
  }

  export type CaseCountAggregateInputType = {
    id?: true
    caseNumber?: true
    title?: true
    category?: true
    status?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    closedAt?: true
    closureReason?: true
    officerId?: true
    _all?: true
  }

  export type CaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Case to aggregate.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cases
    **/
    _count?: true | CaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseMaxAggregateInputType
  }

  export type GetCaseAggregateType<T extends CaseAggregateArgs> = {
        [P in keyof T & keyof AggregateCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCase[P]>
      : GetScalarType<T[P], AggregateCase[P]>
  }




  export type CaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithAggregationInput | CaseOrderByWithAggregationInput[]
    by: CaseScalarFieldEnum[] | CaseScalarFieldEnum
    having?: CaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseCountAggregateInputType | true
    _min?: CaseMinAggregateInputType
    _max?: CaseMaxAggregateInputType
  }

  export type CaseGroupByOutputType = {
    id: string
    caseNumber: string
    title: string
    category: string
    status: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    closedAt: Date | null
    closureReason: string | null
    officerId: string | null
    _count: CaseCountAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  type GetCaseGroupByPayload<T extends CaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseGroupByOutputType[P]>
            : GetScalarType<T[P], CaseGroupByOutputType[P]>
        }
      >
    >


  export type CaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseNumber?: boolean
    title?: boolean
    category?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedAt?: boolean
    closureReason?: boolean
    officerId?: boolean
    officer?: boolean | Case$officerArgs<ExtArgs>
    entries?: boolean | Case$entriesArgs<ExtArgs>
    cdrRequests?: boolean | Case$cdrRequestsArgs<ExtArgs>
    internationalRequests?: boolean | Case$internationalRequestsArgs<ExtArgs>
    caseActivities?: boolean | Case$caseActivitiesArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseNumber?: boolean
    title?: boolean
    category?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedAt?: boolean
    closureReason?: boolean
    officerId?: boolean
    officer?: boolean | Case$officerArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectScalar = {
    id?: boolean
    caseNumber?: boolean
    title?: boolean
    category?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedAt?: boolean
    closureReason?: boolean
    officerId?: boolean
  }

  export type CaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    officer?: boolean | Case$officerArgs<ExtArgs>
    entries?: boolean | Case$entriesArgs<ExtArgs>
    cdrRequests?: boolean | Case$cdrRequestsArgs<ExtArgs>
    internationalRequests?: boolean | Case$internationalRequestsArgs<ExtArgs>
    caseActivities?: boolean | Case$caseActivitiesArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    officer?: boolean | Case$officerArgs<ExtArgs>
  }

  export type $CasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Case"
    objects: {
      officer: Prisma.$UserPayload<ExtArgs> | null
      entries: Prisma.$JournalEntryPayload<ExtArgs>[]
      cdrRequests: Prisma.$CdrRequestPayload<ExtArgs>[]
      internationalRequests: Prisma.$InternationalRequestPayload<ExtArgs>[]
      caseActivities: Prisma.$CaseActivityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseNumber: string
      title: string
      category: string
      status: string
      description: string | null
      createdAt: Date
      updatedAt: Date
      closedAt: Date | null
      closureReason: string | null
      officerId: string | null
    }, ExtArgs["result"]["case"]>
    composites: {}
  }

  type CaseGetPayload<S extends boolean | null | undefined | CaseDefaultArgs> = $Result.GetResult<Prisma.$CasePayload, S>

  type CaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CaseFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CaseCountAggregateInputType | true
    }

  export interface CaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Case'], meta: { name: 'Case' } }
    /**
     * Find zero or one Case that matches the filter.
     * @param {CaseFindUniqueArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseFindUniqueArgs>(args: SelectSubset<T, CaseFindUniqueArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Case that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CaseFindUniqueOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Case that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseFindFirstArgs>(args?: SelectSubset<T, CaseFindFirstArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Case that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Cases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cases
     * const cases = await prisma.case.findMany()
     * 
     * // Get first 10 Cases
     * const cases = await prisma.case.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseWithIdOnly = await prisma.case.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseFindManyArgs>(args?: SelectSubset<T, CaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Case.
     * @param {CaseCreateArgs} args - Arguments to create a Case.
     * @example
     * // Create one Case
     * const Case = await prisma.case.create({
     *   data: {
     *     // ... data to create a Case
     *   }
     * })
     * 
     */
    create<T extends CaseCreateArgs>(args: SelectSubset<T, CaseCreateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Cases.
     * @param {CaseCreateManyArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseCreateManyArgs>(args?: SelectSubset<T, CaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cases and returns the data saved in the database.
     * @param {CaseCreateManyAndReturnArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cases and only return the `id`
     * const caseWithIdOnly = await prisma.case.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Case.
     * @param {CaseDeleteArgs} args - Arguments to delete one Case.
     * @example
     * // Delete one Case
     * const Case = await prisma.case.delete({
     *   where: {
     *     // ... filter to delete one Case
     *   }
     * })
     * 
     */
    delete<T extends CaseDeleteArgs>(args: SelectSubset<T, CaseDeleteArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Case.
     * @param {CaseUpdateArgs} args - Arguments to update one Case.
     * @example
     * // Update one Case
     * const case = await prisma.case.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseUpdateArgs>(args: SelectSubset<T, CaseUpdateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Cases.
     * @param {CaseDeleteManyArgs} args - Arguments to filter Cases to delete.
     * @example
     * // Delete a few Cases
     * const { count } = await prisma.case.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseDeleteManyArgs>(args?: SelectSubset<T, CaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cases
     * const case = await prisma.case.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseUpdateManyArgs>(args: SelectSubset<T, CaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Case.
     * @param {CaseUpsertArgs} args - Arguments to update or create a Case.
     * @example
     * // Update or create a Case
     * const case = await prisma.case.upsert({
     *   create: {
     *     // ... data to create a Case
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Case we want to update
     *   }
     * })
     */
    upsert<T extends CaseUpsertArgs>(args: SelectSubset<T, CaseUpsertArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseCountArgs} args - Arguments to filter Cases to count.
     * @example
     * // Count the number of Cases
     * const count = await prisma.case.count({
     *   where: {
     *     // ... the filter for the Cases we want to count
     *   }
     * })
    **/
    count<T extends CaseCountArgs>(
      args?: Subset<T, CaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseAggregateArgs>(args: Subset<T, CaseAggregateArgs>): Prisma.PrismaPromise<GetCaseAggregateType<T>>

    /**
     * Group by Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseGroupByArgs['orderBy'] }
        : { orderBy?: CaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Case model
   */
  readonly fields: CaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Case.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    officer<T extends Case$officerArgs<ExtArgs> = {}>(args?: Subset<T, Case$officerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    entries<T extends Case$entriesArgs<ExtArgs> = {}>(args?: Subset<T, Case$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany"> | Null>
    cdrRequests<T extends Case$cdrRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Case$cdrRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findMany"> | Null>
    internationalRequests<T extends Case$internationalRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Case$internationalRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findMany"> | Null>
    caseActivities<T extends Case$caseActivitiesArgs<ExtArgs> = {}>(args?: Subset<T, Case$caseActivitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Case model
   */ 
  interface CaseFieldRefs {
    readonly id: FieldRef<"Case", 'String'>
    readonly caseNumber: FieldRef<"Case", 'String'>
    readonly title: FieldRef<"Case", 'String'>
    readonly category: FieldRef<"Case", 'String'>
    readonly status: FieldRef<"Case", 'String'>
    readonly description: FieldRef<"Case", 'String'>
    readonly createdAt: FieldRef<"Case", 'DateTime'>
    readonly updatedAt: FieldRef<"Case", 'DateTime'>
    readonly closedAt: FieldRef<"Case", 'DateTime'>
    readonly closureReason: FieldRef<"Case", 'String'>
    readonly officerId: FieldRef<"Case", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Case findUnique
   */
  export type CaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findUniqueOrThrow
   */
  export type CaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findFirst
   */
  export type CaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findFirstOrThrow
   */
  export type CaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findMany
   */
  export type CaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Cases to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case create
   */
  export type CaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Case.
     */
    data: XOR<CaseCreateInput, CaseUncheckedCreateInput>
  }

  /**
   * Case createMany
   */
  export type CaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
  }

  /**
   * Case createManyAndReturn
   */
  export type CaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Case update
   */
  export type CaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Case.
     */
    data: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
    /**
     * Choose, which Case to update.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case updateMany
   */
  export type CaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cases.
     */
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyInput>
    /**
     * Filter which Cases to update
     */
    where?: CaseWhereInput
  }

  /**
   * Case upsert
   */
  export type CaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Case to update in case it exists.
     */
    where: CaseWhereUniqueInput
    /**
     * In case the Case found by the `where` argument doesn't exist, create a new Case with this data.
     */
    create: XOR<CaseCreateInput, CaseUncheckedCreateInput>
    /**
     * In case the Case was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
  }

  /**
   * Case delete
   */
  export type CaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter which Case to delete.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case deleteMany
   */
  export type CaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cases to delete
     */
    where?: CaseWhereInput
  }

  /**
   * Case.officer
   */
  export type Case$officerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Case.entries
   */
  export type Case$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    cursor?: JournalEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * Case.cdrRequests
   */
  export type Case$cdrRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    where?: CdrRequestWhereInput
    orderBy?: CdrRequestOrderByWithRelationInput | CdrRequestOrderByWithRelationInput[]
    cursor?: CdrRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CdrRequestScalarFieldEnum | CdrRequestScalarFieldEnum[]
  }

  /**
   * Case.internationalRequests
   */
  export type Case$internationalRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    where?: InternationalRequestWhereInput
    orderBy?: InternationalRequestOrderByWithRelationInput | InternationalRequestOrderByWithRelationInput[]
    cursor?: InternationalRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InternationalRequestScalarFieldEnum | InternationalRequestScalarFieldEnum[]
  }

  /**
   * Case.caseActivities
   */
  export type Case$caseActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    where?: CaseActivityWhereInput
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    cursor?: CaseActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * Case without action
   */
  export type CaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
  }


  /**
   * Model JournalEntry
   */

  export type AggregateJournalEntry = {
    _count: JournalEntryCountAggregateOutputType | null
    _avg: JournalEntryAvgAggregateOutputType | null
    _sum: JournalEntrySumAggregateOutputType | null
    _min: JournalEntryMinAggregateOutputType | null
    _max: JournalEntryMaxAggregateOutputType | null
  }

  export type JournalEntryAvgAggregateOutputType = {
    dayNumber: number | null
  }

  export type JournalEntrySumAggregateOutputType = {
    dayNumber: number | null
  }

  export type JournalEntryMinAggregateOutputType = {
    id: string | null
    dayNumber: number | null
    content: string | null
    actions: string | null
    createdAt: Date | null
    caseId: string | null
    authorId: string | null
  }

  export type JournalEntryMaxAggregateOutputType = {
    id: string | null
    dayNumber: number | null
    content: string | null
    actions: string | null
    createdAt: Date | null
    caseId: string | null
    authorId: string | null
  }

  export type JournalEntryCountAggregateOutputType = {
    id: number
    dayNumber: number
    content: number
    actions: number
    createdAt: number
    caseId: number
    authorId: number
    _all: number
  }


  export type JournalEntryAvgAggregateInputType = {
    dayNumber?: true
  }

  export type JournalEntrySumAggregateInputType = {
    dayNumber?: true
  }

  export type JournalEntryMinAggregateInputType = {
    id?: true
    dayNumber?: true
    content?: true
    actions?: true
    createdAt?: true
    caseId?: true
    authorId?: true
  }

  export type JournalEntryMaxAggregateInputType = {
    id?: true
    dayNumber?: true
    content?: true
    actions?: true
    createdAt?: true
    caseId?: true
    authorId?: true
  }

  export type JournalEntryCountAggregateInputType = {
    id?: true
    dayNumber?: true
    content?: true
    actions?: true
    createdAt?: true
    caseId?: true
    authorId?: true
    _all?: true
  }

  export type JournalEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalEntry to aggregate.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JournalEntries
    **/
    _count?: true | JournalEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JournalEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JournalEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JournalEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JournalEntryMaxAggregateInputType
  }

  export type GetJournalEntryAggregateType<T extends JournalEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateJournalEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJournalEntry[P]>
      : GetScalarType<T[P], AggregateJournalEntry[P]>
  }




  export type JournalEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithAggregationInput | JournalEntryOrderByWithAggregationInput[]
    by: JournalEntryScalarFieldEnum[] | JournalEntryScalarFieldEnum
    having?: JournalEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JournalEntryCountAggregateInputType | true
    _avg?: JournalEntryAvgAggregateInputType
    _sum?: JournalEntrySumAggregateInputType
    _min?: JournalEntryMinAggregateInputType
    _max?: JournalEntryMaxAggregateInputType
  }

  export type JournalEntryGroupByOutputType = {
    id: string
    dayNumber: number
    content: string
    actions: string | null
    createdAt: Date
    caseId: string
    authorId: string | null
    _count: JournalEntryCountAggregateOutputType | null
    _avg: JournalEntryAvgAggregateOutputType | null
    _sum: JournalEntrySumAggregateOutputType | null
    _min: JournalEntryMinAggregateOutputType | null
    _max: JournalEntryMaxAggregateOutputType | null
  }

  type GetJournalEntryGroupByPayload<T extends JournalEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JournalEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JournalEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JournalEntryGroupByOutputType[P]>
            : GetScalarType<T[P], JournalEntryGroupByOutputType[P]>
        }
      >
    >


  export type JournalEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayNumber?: boolean
    content?: boolean
    actions?: boolean
    createdAt?: boolean
    caseId?: boolean
    authorId?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    author?: boolean | JournalEntry$authorArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayNumber?: boolean
    content?: boolean
    actions?: boolean
    createdAt?: boolean
    caseId?: boolean
    authorId?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    author?: boolean | JournalEntry$authorArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectScalar = {
    id?: boolean
    dayNumber?: boolean
    content?: boolean
    actions?: boolean
    createdAt?: boolean
    caseId?: boolean
    authorId?: boolean
  }

  export type JournalEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    author?: boolean | JournalEntry$authorArgs<ExtArgs>
  }
  export type JournalEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    author?: boolean | JournalEntry$authorArgs<ExtArgs>
  }

  export type $JournalEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JournalEntry"
    objects: {
      case: Prisma.$CasePayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dayNumber: number
      content: string
      actions: string | null
      createdAt: Date
      caseId: string
      authorId: string | null
    }, ExtArgs["result"]["journalEntry"]>
    composites: {}
  }

  type JournalEntryGetPayload<S extends boolean | null | undefined | JournalEntryDefaultArgs> = $Result.GetResult<Prisma.$JournalEntryPayload, S>

  type JournalEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JournalEntryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JournalEntryCountAggregateInputType | true
    }

  export interface JournalEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JournalEntry'], meta: { name: 'JournalEntry' } }
    /**
     * Find zero or one JournalEntry that matches the filter.
     * @param {JournalEntryFindUniqueArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JournalEntryFindUniqueArgs>(args: SelectSubset<T, JournalEntryFindUniqueArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one JournalEntry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JournalEntryFindUniqueOrThrowArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JournalEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, JournalEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first JournalEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindFirstArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JournalEntryFindFirstArgs>(args?: SelectSubset<T, JournalEntryFindFirstArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first JournalEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindFirstOrThrowArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JournalEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, JournalEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more JournalEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JournalEntries
     * const journalEntries = await prisma.journalEntry.findMany()
     * 
     * // Get first 10 JournalEntries
     * const journalEntries = await prisma.journalEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JournalEntryFindManyArgs>(args?: SelectSubset<T, JournalEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a JournalEntry.
     * @param {JournalEntryCreateArgs} args - Arguments to create a JournalEntry.
     * @example
     * // Create one JournalEntry
     * const JournalEntry = await prisma.journalEntry.create({
     *   data: {
     *     // ... data to create a JournalEntry
     *   }
     * })
     * 
     */
    create<T extends JournalEntryCreateArgs>(args: SelectSubset<T, JournalEntryCreateArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many JournalEntries.
     * @param {JournalEntryCreateManyArgs} args - Arguments to create many JournalEntries.
     * @example
     * // Create many JournalEntries
     * const journalEntry = await prisma.journalEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JournalEntryCreateManyArgs>(args?: SelectSubset<T, JournalEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JournalEntries and returns the data saved in the database.
     * @param {JournalEntryCreateManyAndReturnArgs} args - Arguments to create many JournalEntries.
     * @example
     * // Create many JournalEntries
     * const journalEntry = await prisma.journalEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JournalEntries and only return the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JournalEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, JournalEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a JournalEntry.
     * @param {JournalEntryDeleteArgs} args - Arguments to delete one JournalEntry.
     * @example
     * // Delete one JournalEntry
     * const JournalEntry = await prisma.journalEntry.delete({
     *   where: {
     *     // ... filter to delete one JournalEntry
     *   }
     * })
     * 
     */
    delete<T extends JournalEntryDeleteArgs>(args: SelectSubset<T, JournalEntryDeleteArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one JournalEntry.
     * @param {JournalEntryUpdateArgs} args - Arguments to update one JournalEntry.
     * @example
     * // Update one JournalEntry
     * const journalEntry = await prisma.journalEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JournalEntryUpdateArgs>(args: SelectSubset<T, JournalEntryUpdateArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more JournalEntries.
     * @param {JournalEntryDeleteManyArgs} args - Arguments to filter JournalEntries to delete.
     * @example
     * // Delete a few JournalEntries
     * const { count } = await prisma.journalEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JournalEntryDeleteManyArgs>(args?: SelectSubset<T, JournalEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JournalEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JournalEntries
     * const journalEntry = await prisma.journalEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JournalEntryUpdateManyArgs>(args: SelectSubset<T, JournalEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one JournalEntry.
     * @param {JournalEntryUpsertArgs} args - Arguments to update or create a JournalEntry.
     * @example
     * // Update or create a JournalEntry
     * const journalEntry = await prisma.journalEntry.upsert({
     *   create: {
     *     // ... data to create a JournalEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JournalEntry we want to update
     *   }
     * })
     */
    upsert<T extends JournalEntryUpsertArgs>(args: SelectSubset<T, JournalEntryUpsertArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of JournalEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryCountArgs} args - Arguments to filter JournalEntries to count.
     * @example
     * // Count the number of JournalEntries
     * const count = await prisma.journalEntry.count({
     *   where: {
     *     // ... the filter for the JournalEntries we want to count
     *   }
     * })
    **/
    count<T extends JournalEntryCountArgs>(
      args?: Subset<T, JournalEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JournalEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JournalEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JournalEntryAggregateArgs>(args: Subset<T, JournalEntryAggregateArgs>): Prisma.PrismaPromise<GetJournalEntryAggregateType<T>>

    /**
     * Group by JournalEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JournalEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JournalEntryGroupByArgs['orderBy'] }
        : { orderBy?: JournalEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JournalEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JournalEntry model
   */
  readonly fields: JournalEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JournalEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JournalEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseDefaultArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    author<T extends JournalEntry$authorArgs<ExtArgs> = {}>(args?: Subset<T, JournalEntry$authorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JournalEntry model
   */ 
  interface JournalEntryFieldRefs {
    readonly id: FieldRef<"JournalEntry", 'String'>
    readonly dayNumber: FieldRef<"JournalEntry", 'Int'>
    readonly content: FieldRef<"JournalEntry", 'String'>
    readonly actions: FieldRef<"JournalEntry", 'String'>
    readonly createdAt: FieldRef<"JournalEntry", 'DateTime'>
    readonly caseId: FieldRef<"JournalEntry", 'String'>
    readonly authorId: FieldRef<"JournalEntry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * JournalEntry findUnique
   */
  export type JournalEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry findUniqueOrThrow
   */
  export type JournalEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry findFirst
   */
  export type JournalEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalEntries.
     */
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry findFirstOrThrow
   */
  export type JournalEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalEntries.
     */
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry findMany
   */
  export type JournalEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntries to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry create
   */
  export type JournalEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a JournalEntry.
     */
    data: XOR<JournalEntryCreateInput, JournalEntryUncheckedCreateInput>
  }

  /**
   * JournalEntry createMany
   */
  export type JournalEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JournalEntries.
     */
    data: JournalEntryCreateManyInput | JournalEntryCreateManyInput[]
  }

  /**
   * JournalEntry createManyAndReturn
   */
  export type JournalEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many JournalEntries.
     */
    data: JournalEntryCreateManyInput | JournalEntryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JournalEntry update
   */
  export type JournalEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a JournalEntry.
     */
    data: XOR<JournalEntryUpdateInput, JournalEntryUncheckedUpdateInput>
    /**
     * Choose, which JournalEntry to update.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry updateMany
   */
  export type JournalEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JournalEntries.
     */
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyInput>
    /**
     * Filter which JournalEntries to update
     */
    where?: JournalEntryWhereInput
  }

  /**
   * JournalEntry upsert
   */
  export type JournalEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the JournalEntry to update in case it exists.
     */
    where: JournalEntryWhereUniqueInput
    /**
     * In case the JournalEntry found by the `where` argument doesn't exist, create a new JournalEntry with this data.
     */
    create: XOR<JournalEntryCreateInput, JournalEntryUncheckedCreateInput>
    /**
     * In case the JournalEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JournalEntryUpdateInput, JournalEntryUncheckedUpdateInput>
  }

  /**
   * JournalEntry delete
   */
  export type JournalEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter which JournalEntry to delete.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry deleteMany
   */
  export type JournalEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalEntries to delete
     */
    where?: JournalEntryWhereInput
  }

  /**
   * JournalEntry.author
   */
  export type JournalEntry$authorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * JournalEntry without action
   */
  export type JournalEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
  }


  /**
   * Model CaseActivity
   */

  export type AggregateCaseActivity = {
    _count: CaseActivityCountAggregateOutputType | null
    _min: CaseActivityMinAggregateOutputType | null
    _max: CaseActivityMaxAggregateOutputType | null
  }

  export type CaseActivityMinAggregateOutputType = {
    id: string | null
    caseId: string | null
    userId: string | null
    userName: string | null
    action: string | null
    detail: string | null
    createdAt: Date | null
  }

  export type CaseActivityMaxAggregateOutputType = {
    id: string | null
    caseId: string | null
    userId: string | null
    userName: string | null
    action: string | null
    detail: string | null
    createdAt: Date | null
  }

  export type CaseActivityCountAggregateOutputType = {
    id: number
    caseId: number
    userId: number
    userName: number
    action: number
    detail: number
    createdAt: number
    _all: number
  }


  export type CaseActivityMinAggregateInputType = {
    id?: true
    caseId?: true
    userId?: true
    userName?: true
    action?: true
    detail?: true
    createdAt?: true
  }

  export type CaseActivityMaxAggregateInputType = {
    id?: true
    caseId?: true
    userId?: true
    userName?: true
    action?: true
    detail?: true
    createdAt?: true
  }

  export type CaseActivityCountAggregateInputType = {
    id?: true
    caseId?: true
    userId?: true
    userName?: true
    action?: true
    detail?: true
    createdAt?: true
    _all?: true
  }

  export type CaseActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseActivity to aggregate.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseActivities
    **/
    _count?: true | CaseActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseActivityMaxAggregateInputType
  }

  export type GetCaseActivityAggregateType<T extends CaseActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseActivity[P]>
      : GetScalarType<T[P], AggregateCaseActivity[P]>
  }




  export type CaseActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseActivityWhereInput
    orderBy?: CaseActivityOrderByWithAggregationInput | CaseActivityOrderByWithAggregationInput[]
    by: CaseActivityScalarFieldEnum[] | CaseActivityScalarFieldEnum
    having?: CaseActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseActivityCountAggregateInputType | true
    _min?: CaseActivityMinAggregateInputType
    _max?: CaseActivityMaxAggregateInputType
  }

  export type CaseActivityGroupByOutputType = {
    id: string
    caseId: string
    userId: string | null
    userName: string
    action: string
    detail: string | null
    createdAt: Date
    _count: CaseActivityCountAggregateOutputType | null
    _min: CaseActivityMinAggregateOutputType | null
    _max: CaseActivityMaxAggregateOutputType | null
  }

  type GetCaseActivityGroupByPayload<T extends CaseActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseActivityGroupByOutputType[P]>
            : GetScalarType<T[P], CaseActivityGroupByOutputType[P]>
        }
      >
    >


  export type CaseActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    userId?: boolean
    userName?: boolean
    action?: boolean
    detail?: boolean
    createdAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseActivity"]>

  export type CaseActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    userId?: boolean
    userName?: boolean
    action?: boolean
    detail?: boolean
    createdAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseActivity"]>

  export type CaseActivitySelectScalar = {
    id?: boolean
    caseId?: boolean
    userId?: boolean
    userName?: boolean
    action?: boolean
    detail?: boolean
    createdAt?: boolean
  }

  export type CaseActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }
  export type CaseActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }

  export type $CaseActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseActivity"
    objects: {
      case: Prisma.$CasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseId: string
      userId: string | null
      userName: string
      action: string
      detail: string | null
      createdAt: Date
    }, ExtArgs["result"]["caseActivity"]>
    composites: {}
  }

  type CaseActivityGetPayload<S extends boolean | null | undefined | CaseActivityDefaultArgs> = $Result.GetResult<Prisma.$CaseActivityPayload, S>

  type CaseActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CaseActivityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CaseActivityCountAggregateInputType | true
    }

  export interface CaseActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseActivity'], meta: { name: 'CaseActivity' } }
    /**
     * Find zero or one CaseActivity that matches the filter.
     * @param {CaseActivityFindUniqueArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseActivityFindUniqueArgs>(args: SelectSubset<T, CaseActivityFindUniqueArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CaseActivity that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CaseActivityFindUniqueOrThrowArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CaseActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityFindFirstArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseActivityFindFirstArgs>(args?: SelectSubset<T, CaseActivityFindFirstArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CaseActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityFindFirstOrThrowArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CaseActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseActivities
     * const caseActivities = await prisma.caseActivity.findMany()
     * 
     * // Get first 10 CaseActivities
     * const caseActivities = await prisma.caseActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseActivityWithIdOnly = await prisma.caseActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseActivityFindManyArgs>(args?: SelectSubset<T, CaseActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CaseActivity.
     * @param {CaseActivityCreateArgs} args - Arguments to create a CaseActivity.
     * @example
     * // Create one CaseActivity
     * const CaseActivity = await prisma.caseActivity.create({
     *   data: {
     *     // ... data to create a CaseActivity
     *   }
     * })
     * 
     */
    create<T extends CaseActivityCreateArgs>(args: SelectSubset<T, CaseActivityCreateArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CaseActivities.
     * @param {CaseActivityCreateManyArgs} args - Arguments to create many CaseActivities.
     * @example
     * // Create many CaseActivities
     * const caseActivity = await prisma.caseActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseActivityCreateManyArgs>(args?: SelectSubset<T, CaseActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseActivities and returns the data saved in the database.
     * @param {CaseActivityCreateManyAndReturnArgs} args - Arguments to create many CaseActivities.
     * @example
     * // Create many CaseActivities
     * const caseActivity = await prisma.caseActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseActivities and only return the `id`
     * const caseActivityWithIdOnly = await prisma.caseActivity.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CaseActivity.
     * @param {CaseActivityDeleteArgs} args - Arguments to delete one CaseActivity.
     * @example
     * // Delete one CaseActivity
     * const CaseActivity = await prisma.caseActivity.delete({
     *   where: {
     *     // ... filter to delete one CaseActivity
     *   }
     * })
     * 
     */
    delete<T extends CaseActivityDeleteArgs>(args: SelectSubset<T, CaseActivityDeleteArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CaseActivity.
     * @param {CaseActivityUpdateArgs} args - Arguments to update one CaseActivity.
     * @example
     * // Update one CaseActivity
     * const caseActivity = await prisma.caseActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseActivityUpdateArgs>(args: SelectSubset<T, CaseActivityUpdateArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CaseActivities.
     * @param {CaseActivityDeleteManyArgs} args - Arguments to filter CaseActivities to delete.
     * @example
     * // Delete a few CaseActivities
     * const { count } = await prisma.caseActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseActivityDeleteManyArgs>(args?: SelectSubset<T, CaseActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseActivities
     * const caseActivity = await prisma.caseActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseActivityUpdateManyArgs>(args: SelectSubset<T, CaseActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CaseActivity.
     * @param {CaseActivityUpsertArgs} args - Arguments to update or create a CaseActivity.
     * @example
     * // Update or create a CaseActivity
     * const caseActivity = await prisma.caseActivity.upsert({
     *   create: {
     *     // ... data to create a CaseActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseActivity we want to update
     *   }
     * })
     */
    upsert<T extends CaseActivityUpsertArgs>(args: SelectSubset<T, CaseActivityUpsertArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CaseActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityCountArgs} args - Arguments to filter CaseActivities to count.
     * @example
     * // Count the number of CaseActivities
     * const count = await prisma.caseActivity.count({
     *   where: {
     *     // ... the filter for the CaseActivities we want to count
     *   }
     * })
    **/
    count<T extends CaseActivityCountArgs>(
      args?: Subset<T, CaseActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseActivityAggregateArgs>(args: Subset<T, CaseActivityAggregateArgs>): Prisma.PrismaPromise<GetCaseActivityAggregateType<T>>

    /**
     * Group by CaseActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseActivityGroupByArgs['orderBy'] }
        : { orderBy?: CaseActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseActivity model
   */
  readonly fields: CaseActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseDefaultArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseActivity model
   */ 
  interface CaseActivityFieldRefs {
    readonly id: FieldRef<"CaseActivity", 'String'>
    readonly caseId: FieldRef<"CaseActivity", 'String'>
    readonly userId: FieldRef<"CaseActivity", 'String'>
    readonly userName: FieldRef<"CaseActivity", 'String'>
    readonly action: FieldRef<"CaseActivity", 'String'>
    readonly detail: FieldRef<"CaseActivity", 'String'>
    readonly createdAt: FieldRef<"CaseActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CaseActivity findUnique
   */
  export type CaseActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity findUniqueOrThrow
   */
  export type CaseActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity findFirst
   */
  export type CaseActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseActivities.
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseActivities.
     */
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * CaseActivity findFirstOrThrow
   */
  export type CaseActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseActivities.
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseActivities.
     */
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * CaseActivity findMany
   */
  export type CaseActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivities to fetch.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseActivities.
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * CaseActivity create
   */
  export type CaseActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseActivity.
     */
    data: XOR<CaseActivityCreateInput, CaseActivityUncheckedCreateInput>
  }

  /**
   * CaseActivity createMany
   */
  export type CaseActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseActivities.
     */
    data: CaseActivityCreateManyInput | CaseActivityCreateManyInput[]
  }

  /**
   * CaseActivity createManyAndReturn
   */
  export type CaseActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CaseActivities.
     */
    data: CaseActivityCreateManyInput | CaseActivityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseActivity update
   */
  export type CaseActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseActivity.
     */
    data: XOR<CaseActivityUpdateInput, CaseActivityUncheckedUpdateInput>
    /**
     * Choose, which CaseActivity to update.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity updateMany
   */
  export type CaseActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseActivities.
     */
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyInput>
    /**
     * Filter which CaseActivities to update
     */
    where?: CaseActivityWhereInput
  }

  /**
   * CaseActivity upsert
   */
  export type CaseActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseActivity to update in case it exists.
     */
    where: CaseActivityWhereUniqueInput
    /**
     * In case the CaseActivity found by the `where` argument doesn't exist, create a new CaseActivity with this data.
     */
    create: XOR<CaseActivityCreateInput, CaseActivityUncheckedCreateInput>
    /**
     * In case the CaseActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseActivityUpdateInput, CaseActivityUncheckedUpdateInput>
  }

  /**
   * CaseActivity delete
   */
  export type CaseActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter which CaseActivity to delete.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity deleteMany
   */
  export type CaseActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseActivities to delete
     */
    where?: CaseActivityWhereInput
  }

  /**
   * CaseActivity without action
   */
  export type CaseActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
  }


  /**
   * Model CdrRequest
   */

  export type AggregateCdrRequest = {
    _count: CdrRequestCountAggregateOutputType | null
    _min: CdrRequestMinAggregateOutputType | null
    _max: CdrRequestMaxAggregateOutputType | null
  }

  export type CdrRequestMinAggregateOutputType = {
    id: string | null
    phoneNumber: string | null
    telco: string | null
    periodStart: Date | null
    periodEnd: Date | null
    reason: string | null
    status: string | null
    requestedAt: Date | null
    receivedAt: Date | null
    caseId: string | null
    officerId: string | null
    attachmentPath: string | null
    attachmentName: string | null
  }

  export type CdrRequestMaxAggregateOutputType = {
    id: string | null
    phoneNumber: string | null
    telco: string | null
    periodStart: Date | null
    periodEnd: Date | null
    reason: string | null
    status: string | null
    requestedAt: Date | null
    receivedAt: Date | null
    caseId: string | null
    officerId: string | null
    attachmentPath: string | null
    attachmentName: string | null
  }

  export type CdrRequestCountAggregateOutputType = {
    id: number
    phoneNumber: number
    telco: number
    periodStart: number
    periodEnd: number
    reason: number
    status: number
    requestedAt: number
    receivedAt: number
    caseId: number
    officerId: number
    attachmentPath: number
    attachmentName: number
    _all: number
  }


  export type CdrRequestMinAggregateInputType = {
    id?: true
    phoneNumber?: true
    telco?: true
    periodStart?: true
    periodEnd?: true
    reason?: true
    status?: true
    requestedAt?: true
    receivedAt?: true
    caseId?: true
    officerId?: true
    attachmentPath?: true
    attachmentName?: true
  }

  export type CdrRequestMaxAggregateInputType = {
    id?: true
    phoneNumber?: true
    telco?: true
    periodStart?: true
    periodEnd?: true
    reason?: true
    status?: true
    requestedAt?: true
    receivedAt?: true
    caseId?: true
    officerId?: true
    attachmentPath?: true
    attachmentName?: true
  }

  export type CdrRequestCountAggregateInputType = {
    id?: true
    phoneNumber?: true
    telco?: true
    periodStart?: true
    periodEnd?: true
    reason?: true
    status?: true
    requestedAt?: true
    receivedAt?: true
    caseId?: true
    officerId?: true
    attachmentPath?: true
    attachmentName?: true
    _all?: true
  }

  export type CdrRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CdrRequest to aggregate.
     */
    where?: CdrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CdrRequests to fetch.
     */
    orderBy?: CdrRequestOrderByWithRelationInput | CdrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CdrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CdrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CdrRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CdrRequests
    **/
    _count?: true | CdrRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CdrRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CdrRequestMaxAggregateInputType
  }

  export type GetCdrRequestAggregateType<T extends CdrRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateCdrRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCdrRequest[P]>
      : GetScalarType<T[P], AggregateCdrRequest[P]>
  }




  export type CdrRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CdrRequestWhereInput
    orderBy?: CdrRequestOrderByWithAggregationInput | CdrRequestOrderByWithAggregationInput[]
    by: CdrRequestScalarFieldEnum[] | CdrRequestScalarFieldEnum
    having?: CdrRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CdrRequestCountAggregateInputType | true
    _min?: CdrRequestMinAggregateInputType
    _max?: CdrRequestMaxAggregateInputType
  }

  export type CdrRequestGroupByOutputType = {
    id: string
    phoneNumber: string
    telco: string
    periodStart: Date
    periodEnd: Date
    reason: string
    status: string
    requestedAt: Date
    receivedAt: Date | null
    caseId: string | null
    officerId: string | null
    attachmentPath: string | null
    attachmentName: string | null
    _count: CdrRequestCountAggregateOutputType | null
    _min: CdrRequestMinAggregateOutputType | null
    _max: CdrRequestMaxAggregateOutputType | null
  }

  type GetCdrRequestGroupByPayload<T extends CdrRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CdrRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CdrRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CdrRequestGroupByOutputType[P]>
            : GetScalarType<T[P], CdrRequestGroupByOutputType[P]>
        }
      >
    >


  export type CdrRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    telco?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    reason?: boolean
    status?: boolean
    requestedAt?: boolean
    receivedAt?: boolean
    caseId?: boolean
    officerId?: boolean
    attachmentPath?: boolean
    attachmentName?: boolean
    case?: boolean | CdrRequest$caseArgs<ExtArgs>
    officer?: boolean | CdrRequest$officerArgs<ExtArgs>
  }, ExtArgs["result"]["cdrRequest"]>

  export type CdrRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    telco?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    reason?: boolean
    status?: boolean
    requestedAt?: boolean
    receivedAt?: boolean
    caseId?: boolean
    officerId?: boolean
    attachmentPath?: boolean
    attachmentName?: boolean
    case?: boolean | CdrRequest$caseArgs<ExtArgs>
    officer?: boolean | CdrRequest$officerArgs<ExtArgs>
  }, ExtArgs["result"]["cdrRequest"]>

  export type CdrRequestSelectScalar = {
    id?: boolean
    phoneNumber?: boolean
    telco?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    reason?: boolean
    status?: boolean
    requestedAt?: boolean
    receivedAt?: boolean
    caseId?: boolean
    officerId?: boolean
    attachmentPath?: boolean
    attachmentName?: boolean
  }

  export type CdrRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CdrRequest$caseArgs<ExtArgs>
    officer?: boolean | CdrRequest$officerArgs<ExtArgs>
  }
  export type CdrRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CdrRequest$caseArgs<ExtArgs>
    officer?: boolean | CdrRequest$officerArgs<ExtArgs>
  }

  export type $CdrRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CdrRequest"
    objects: {
      case: Prisma.$CasePayload<ExtArgs> | null
      officer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phoneNumber: string
      telco: string
      periodStart: Date
      periodEnd: Date
      reason: string
      status: string
      requestedAt: Date
      receivedAt: Date | null
      caseId: string | null
      officerId: string | null
      attachmentPath: string | null
      attachmentName: string | null
    }, ExtArgs["result"]["cdrRequest"]>
    composites: {}
  }

  type CdrRequestGetPayload<S extends boolean | null | undefined | CdrRequestDefaultArgs> = $Result.GetResult<Prisma.$CdrRequestPayload, S>

  type CdrRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CdrRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CdrRequestCountAggregateInputType | true
    }

  export interface CdrRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CdrRequest'], meta: { name: 'CdrRequest' } }
    /**
     * Find zero or one CdrRequest that matches the filter.
     * @param {CdrRequestFindUniqueArgs} args - Arguments to find a CdrRequest
     * @example
     * // Get one CdrRequest
     * const cdrRequest = await prisma.cdrRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CdrRequestFindUniqueArgs>(args: SelectSubset<T, CdrRequestFindUniqueArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CdrRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CdrRequestFindUniqueOrThrowArgs} args - Arguments to find a CdrRequest
     * @example
     * // Get one CdrRequest
     * const cdrRequest = await prisma.cdrRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CdrRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, CdrRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CdrRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestFindFirstArgs} args - Arguments to find a CdrRequest
     * @example
     * // Get one CdrRequest
     * const cdrRequest = await prisma.cdrRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CdrRequestFindFirstArgs>(args?: SelectSubset<T, CdrRequestFindFirstArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CdrRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestFindFirstOrThrowArgs} args - Arguments to find a CdrRequest
     * @example
     * // Get one CdrRequest
     * const cdrRequest = await prisma.cdrRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CdrRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, CdrRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CdrRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CdrRequests
     * const cdrRequests = await prisma.cdrRequest.findMany()
     * 
     * // Get first 10 CdrRequests
     * const cdrRequests = await prisma.cdrRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cdrRequestWithIdOnly = await prisma.cdrRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CdrRequestFindManyArgs>(args?: SelectSubset<T, CdrRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CdrRequest.
     * @param {CdrRequestCreateArgs} args - Arguments to create a CdrRequest.
     * @example
     * // Create one CdrRequest
     * const CdrRequest = await prisma.cdrRequest.create({
     *   data: {
     *     // ... data to create a CdrRequest
     *   }
     * })
     * 
     */
    create<T extends CdrRequestCreateArgs>(args: SelectSubset<T, CdrRequestCreateArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CdrRequests.
     * @param {CdrRequestCreateManyArgs} args - Arguments to create many CdrRequests.
     * @example
     * // Create many CdrRequests
     * const cdrRequest = await prisma.cdrRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CdrRequestCreateManyArgs>(args?: SelectSubset<T, CdrRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CdrRequests and returns the data saved in the database.
     * @param {CdrRequestCreateManyAndReturnArgs} args - Arguments to create many CdrRequests.
     * @example
     * // Create many CdrRequests
     * const cdrRequest = await prisma.cdrRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CdrRequests and only return the `id`
     * const cdrRequestWithIdOnly = await prisma.cdrRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CdrRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, CdrRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CdrRequest.
     * @param {CdrRequestDeleteArgs} args - Arguments to delete one CdrRequest.
     * @example
     * // Delete one CdrRequest
     * const CdrRequest = await prisma.cdrRequest.delete({
     *   where: {
     *     // ... filter to delete one CdrRequest
     *   }
     * })
     * 
     */
    delete<T extends CdrRequestDeleteArgs>(args: SelectSubset<T, CdrRequestDeleteArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CdrRequest.
     * @param {CdrRequestUpdateArgs} args - Arguments to update one CdrRequest.
     * @example
     * // Update one CdrRequest
     * const cdrRequest = await prisma.cdrRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CdrRequestUpdateArgs>(args: SelectSubset<T, CdrRequestUpdateArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CdrRequests.
     * @param {CdrRequestDeleteManyArgs} args - Arguments to filter CdrRequests to delete.
     * @example
     * // Delete a few CdrRequests
     * const { count } = await prisma.cdrRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CdrRequestDeleteManyArgs>(args?: SelectSubset<T, CdrRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CdrRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CdrRequests
     * const cdrRequest = await prisma.cdrRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CdrRequestUpdateManyArgs>(args: SelectSubset<T, CdrRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CdrRequest.
     * @param {CdrRequestUpsertArgs} args - Arguments to update or create a CdrRequest.
     * @example
     * // Update or create a CdrRequest
     * const cdrRequest = await prisma.cdrRequest.upsert({
     *   create: {
     *     // ... data to create a CdrRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CdrRequest we want to update
     *   }
     * })
     */
    upsert<T extends CdrRequestUpsertArgs>(args: SelectSubset<T, CdrRequestUpsertArgs<ExtArgs>>): Prisma__CdrRequestClient<$Result.GetResult<Prisma.$CdrRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CdrRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestCountArgs} args - Arguments to filter CdrRequests to count.
     * @example
     * // Count the number of CdrRequests
     * const count = await prisma.cdrRequest.count({
     *   where: {
     *     // ... the filter for the CdrRequests we want to count
     *   }
     * })
    **/
    count<T extends CdrRequestCountArgs>(
      args?: Subset<T, CdrRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CdrRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CdrRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CdrRequestAggregateArgs>(args: Subset<T, CdrRequestAggregateArgs>): Prisma.PrismaPromise<GetCdrRequestAggregateType<T>>

    /**
     * Group by CdrRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CdrRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CdrRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CdrRequestGroupByArgs['orderBy'] }
        : { orderBy?: CdrRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CdrRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCdrRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CdrRequest model
   */
  readonly fields: CdrRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CdrRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CdrRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CdrRequest$caseArgs<ExtArgs> = {}>(args?: Subset<T, CdrRequest$caseArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    officer<T extends CdrRequest$officerArgs<ExtArgs> = {}>(args?: Subset<T, CdrRequest$officerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CdrRequest model
   */ 
  interface CdrRequestFieldRefs {
    readonly id: FieldRef<"CdrRequest", 'String'>
    readonly phoneNumber: FieldRef<"CdrRequest", 'String'>
    readonly telco: FieldRef<"CdrRequest", 'String'>
    readonly periodStart: FieldRef<"CdrRequest", 'DateTime'>
    readonly periodEnd: FieldRef<"CdrRequest", 'DateTime'>
    readonly reason: FieldRef<"CdrRequest", 'String'>
    readonly status: FieldRef<"CdrRequest", 'String'>
    readonly requestedAt: FieldRef<"CdrRequest", 'DateTime'>
    readonly receivedAt: FieldRef<"CdrRequest", 'DateTime'>
    readonly caseId: FieldRef<"CdrRequest", 'String'>
    readonly officerId: FieldRef<"CdrRequest", 'String'>
    readonly attachmentPath: FieldRef<"CdrRequest", 'String'>
    readonly attachmentName: FieldRef<"CdrRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CdrRequest findUnique
   */
  export type CdrRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * Filter, which CdrRequest to fetch.
     */
    where: CdrRequestWhereUniqueInput
  }

  /**
   * CdrRequest findUniqueOrThrow
   */
  export type CdrRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * Filter, which CdrRequest to fetch.
     */
    where: CdrRequestWhereUniqueInput
  }

  /**
   * CdrRequest findFirst
   */
  export type CdrRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * Filter, which CdrRequest to fetch.
     */
    where?: CdrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CdrRequests to fetch.
     */
    orderBy?: CdrRequestOrderByWithRelationInput | CdrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CdrRequests.
     */
    cursor?: CdrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CdrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CdrRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CdrRequests.
     */
    distinct?: CdrRequestScalarFieldEnum | CdrRequestScalarFieldEnum[]
  }

  /**
   * CdrRequest findFirstOrThrow
   */
  export type CdrRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * Filter, which CdrRequest to fetch.
     */
    where?: CdrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CdrRequests to fetch.
     */
    orderBy?: CdrRequestOrderByWithRelationInput | CdrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CdrRequests.
     */
    cursor?: CdrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CdrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CdrRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CdrRequests.
     */
    distinct?: CdrRequestScalarFieldEnum | CdrRequestScalarFieldEnum[]
  }

  /**
   * CdrRequest findMany
   */
  export type CdrRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * Filter, which CdrRequests to fetch.
     */
    where?: CdrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CdrRequests to fetch.
     */
    orderBy?: CdrRequestOrderByWithRelationInput | CdrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CdrRequests.
     */
    cursor?: CdrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CdrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CdrRequests.
     */
    skip?: number
    distinct?: CdrRequestScalarFieldEnum | CdrRequestScalarFieldEnum[]
  }

  /**
   * CdrRequest create
   */
  export type CdrRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a CdrRequest.
     */
    data: XOR<CdrRequestCreateInput, CdrRequestUncheckedCreateInput>
  }

  /**
   * CdrRequest createMany
   */
  export type CdrRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CdrRequests.
     */
    data: CdrRequestCreateManyInput | CdrRequestCreateManyInput[]
  }

  /**
   * CdrRequest createManyAndReturn
   */
  export type CdrRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CdrRequests.
     */
    data: CdrRequestCreateManyInput | CdrRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CdrRequest update
   */
  export type CdrRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a CdrRequest.
     */
    data: XOR<CdrRequestUpdateInput, CdrRequestUncheckedUpdateInput>
    /**
     * Choose, which CdrRequest to update.
     */
    where: CdrRequestWhereUniqueInput
  }

  /**
   * CdrRequest updateMany
   */
  export type CdrRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CdrRequests.
     */
    data: XOR<CdrRequestUpdateManyMutationInput, CdrRequestUncheckedUpdateManyInput>
    /**
     * Filter which CdrRequests to update
     */
    where?: CdrRequestWhereInput
  }

  /**
   * CdrRequest upsert
   */
  export type CdrRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the CdrRequest to update in case it exists.
     */
    where: CdrRequestWhereUniqueInput
    /**
     * In case the CdrRequest found by the `where` argument doesn't exist, create a new CdrRequest with this data.
     */
    create: XOR<CdrRequestCreateInput, CdrRequestUncheckedCreateInput>
    /**
     * In case the CdrRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CdrRequestUpdateInput, CdrRequestUncheckedUpdateInput>
  }

  /**
   * CdrRequest delete
   */
  export type CdrRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
    /**
     * Filter which CdrRequest to delete.
     */
    where: CdrRequestWhereUniqueInput
  }

  /**
   * CdrRequest deleteMany
   */
  export type CdrRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CdrRequests to delete
     */
    where?: CdrRequestWhereInput
  }

  /**
   * CdrRequest.case
   */
  export type CdrRequest$caseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
  }

  /**
   * CdrRequest.officer
   */
  export type CdrRequest$officerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * CdrRequest without action
   */
  export type CdrRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CdrRequest
     */
    select?: CdrRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CdrRequestInclude<ExtArgs> | null
  }


  /**
   * Model InternationalRequest
   */

  export type AggregateInternationalRequest = {
    _count: InternationalRequestCountAggregateOutputType | null
    _min: InternationalRequestMinAggregateOutputType | null
    _max: InternationalRequestMaxAggregateOutputType | null
  }

  export type InternationalRequestMinAggregateOutputType = {
    id: string | null
    refNumber: string | null
    direction: string | null
    country: string | null
    agency: string | null
    subject: string | null
    details: string | null
    status: string | null
    priority: string | null
    caseId: string | null
    officerId: string | null
    createdAt: Date | null
    respondedAt: Date | null
    attachmentPath: string | null
    attachmentName: string | null
  }

  export type InternationalRequestMaxAggregateOutputType = {
    id: string | null
    refNumber: string | null
    direction: string | null
    country: string | null
    agency: string | null
    subject: string | null
    details: string | null
    status: string | null
    priority: string | null
    caseId: string | null
    officerId: string | null
    createdAt: Date | null
    respondedAt: Date | null
    attachmentPath: string | null
    attachmentName: string | null
  }

  export type InternationalRequestCountAggregateOutputType = {
    id: number
    refNumber: number
    direction: number
    country: number
    agency: number
    subject: number
    details: number
    status: number
    priority: number
    caseId: number
    officerId: number
    createdAt: number
    respondedAt: number
    attachmentPath: number
    attachmentName: number
    _all: number
  }


  export type InternationalRequestMinAggregateInputType = {
    id?: true
    refNumber?: true
    direction?: true
    country?: true
    agency?: true
    subject?: true
    details?: true
    status?: true
    priority?: true
    caseId?: true
    officerId?: true
    createdAt?: true
    respondedAt?: true
    attachmentPath?: true
    attachmentName?: true
  }

  export type InternationalRequestMaxAggregateInputType = {
    id?: true
    refNumber?: true
    direction?: true
    country?: true
    agency?: true
    subject?: true
    details?: true
    status?: true
    priority?: true
    caseId?: true
    officerId?: true
    createdAt?: true
    respondedAt?: true
    attachmentPath?: true
    attachmentName?: true
  }

  export type InternationalRequestCountAggregateInputType = {
    id?: true
    refNumber?: true
    direction?: true
    country?: true
    agency?: true
    subject?: true
    details?: true
    status?: true
    priority?: true
    caseId?: true
    officerId?: true
    createdAt?: true
    respondedAt?: true
    attachmentPath?: true
    attachmentName?: true
    _all?: true
  }

  export type InternationalRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InternationalRequest to aggregate.
     */
    where?: InternationalRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternationalRequests to fetch.
     */
    orderBy?: InternationalRequestOrderByWithRelationInput | InternationalRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InternationalRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternationalRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternationalRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InternationalRequests
    **/
    _count?: true | InternationalRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InternationalRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InternationalRequestMaxAggregateInputType
  }

  export type GetInternationalRequestAggregateType<T extends InternationalRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateInternationalRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInternationalRequest[P]>
      : GetScalarType<T[P], AggregateInternationalRequest[P]>
  }




  export type InternationalRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InternationalRequestWhereInput
    orderBy?: InternationalRequestOrderByWithAggregationInput | InternationalRequestOrderByWithAggregationInput[]
    by: InternationalRequestScalarFieldEnum[] | InternationalRequestScalarFieldEnum
    having?: InternationalRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InternationalRequestCountAggregateInputType | true
    _min?: InternationalRequestMinAggregateInputType
    _max?: InternationalRequestMaxAggregateInputType
  }

  export type InternationalRequestGroupByOutputType = {
    id: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details: string | null
    status: string
    priority: string
    caseId: string | null
    officerId: string | null
    createdAt: Date
    respondedAt: Date | null
    attachmentPath: string | null
    attachmentName: string | null
    _count: InternationalRequestCountAggregateOutputType | null
    _min: InternationalRequestMinAggregateOutputType | null
    _max: InternationalRequestMaxAggregateOutputType | null
  }

  type GetInternationalRequestGroupByPayload<T extends InternationalRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InternationalRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InternationalRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InternationalRequestGroupByOutputType[P]>
            : GetScalarType<T[P], InternationalRequestGroupByOutputType[P]>
        }
      >
    >


  export type InternationalRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    refNumber?: boolean
    direction?: boolean
    country?: boolean
    agency?: boolean
    subject?: boolean
    details?: boolean
    status?: boolean
    priority?: boolean
    caseId?: boolean
    officerId?: boolean
    createdAt?: boolean
    respondedAt?: boolean
    attachmentPath?: boolean
    attachmentName?: boolean
    case?: boolean | InternationalRequest$caseArgs<ExtArgs>
    officer?: boolean | InternationalRequest$officerArgs<ExtArgs>
  }, ExtArgs["result"]["internationalRequest"]>

  export type InternationalRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    refNumber?: boolean
    direction?: boolean
    country?: boolean
    agency?: boolean
    subject?: boolean
    details?: boolean
    status?: boolean
    priority?: boolean
    caseId?: boolean
    officerId?: boolean
    createdAt?: boolean
    respondedAt?: boolean
    attachmentPath?: boolean
    attachmentName?: boolean
    case?: boolean | InternationalRequest$caseArgs<ExtArgs>
    officer?: boolean | InternationalRequest$officerArgs<ExtArgs>
  }, ExtArgs["result"]["internationalRequest"]>

  export type InternationalRequestSelectScalar = {
    id?: boolean
    refNumber?: boolean
    direction?: boolean
    country?: boolean
    agency?: boolean
    subject?: boolean
    details?: boolean
    status?: boolean
    priority?: boolean
    caseId?: boolean
    officerId?: boolean
    createdAt?: boolean
    respondedAt?: boolean
    attachmentPath?: boolean
    attachmentName?: boolean
  }

  export type InternationalRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | InternationalRequest$caseArgs<ExtArgs>
    officer?: boolean | InternationalRequest$officerArgs<ExtArgs>
  }
  export type InternationalRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | InternationalRequest$caseArgs<ExtArgs>
    officer?: boolean | InternationalRequest$officerArgs<ExtArgs>
  }

  export type $InternationalRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InternationalRequest"
    objects: {
      case: Prisma.$CasePayload<ExtArgs> | null
      officer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      refNumber: string
      direction: string
      country: string
      agency: string
      subject: string
      details: string | null
      status: string
      priority: string
      caseId: string | null
      officerId: string | null
      createdAt: Date
      respondedAt: Date | null
      attachmentPath: string | null
      attachmentName: string | null
    }, ExtArgs["result"]["internationalRequest"]>
    composites: {}
  }

  type InternationalRequestGetPayload<S extends boolean | null | undefined | InternationalRequestDefaultArgs> = $Result.GetResult<Prisma.$InternationalRequestPayload, S>

  type InternationalRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InternationalRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InternationalRequestCountAggregateInputType | true
    }

  export interface InternationalRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InternationalRequest'], meta: { name: 'InternationalRequest' } }
    /**
     * Find zero or one InternationalRequest that matches the filter.
     * @param {InternationalRequestFindUniqueArgs} args - Arguments to find a InternationalRequest
     * @example
     * // Get one InternationalRequest
     * const internationalRequest = await prisma.internationalRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InternationalRequestFindUniqueArgs>(args: SelectSubset<T, InternationalRequestFindUniqueArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InternationalRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InternationalRequestFindUniqueOrThrowArgs} args - Arguments to find a InternationalRequest
     * @example
     * // Get one InternationalRequest
     * const internationalRequest = await prisma.internationalRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InternationalRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, InternationalRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InternationalRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestFindFirstArgs} args - Arguments to find a InternationalRequest
     * @example
     * // Get one InternationalRequest
     * const internationalRequest = await prisma.internationalRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InternationalRequestFindFirstArgs>(args?: SelectSubset<T, InternationalRequestFindFirstArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InternationalRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestFindFirstOrThrowArgs} args - Arguments to find a InternationalRequest
     * @example
     * // Get one InternationalRequest
     * const internationalRequest = await prisma.internationalRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InternationalRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, InternationalRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InternationalRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InternationalRequests
     * const internationalRequests = await prisma.internationalRequest.findMany()
     * 
     * // Get first 10 InternationalRequests
     * const internationalRequests = await prisma.internationalRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const internationalRequestWithIdOnly = await prisma.internationalRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InternationalRequestFindManyArgs>(args?: SelectSubset<T, InternationalRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InternationalRequest.
     * @param {InternationalRequestCreateArgs} args - Arguments to create a InternationalRequest.
     * @example
     * // Create one InternationalRequest
     * const InternationalRequest = await prisma.internationalRequest.create({
     *   data: {
     *     // ... data to create a InternationalRequest
     *   }
     * })
     * 
     */
    create<T extends InternationalRequestCreateArgs>(args: SelectSubset<T, InternationalRequestCreateArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InternationalRequests.
     * @param {InternationalRequestCreateManyArgs} args - Arguments to create many InternationalRequests.
     * @example
     * // Create many InternationalRequests
     * const internationalRequest = await prisma.internationalRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InternationalRequestCreateManyArgs>(args?: SelectSubset<T, InternationalRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InternationalRequests and returns the data saved in the database.
     * @param {InternationalRequestCreateManyAndReturnArgs} args - Arguments to create many InternationalRequests.
     * @example
     * // Create many InternationalRequests
     * const internationalRequest = await prisma.internationalRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InternationalRequests and only return the `id`
     * const internationalRequestWithIdOnly = await prisma.internationalRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InternationalRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, InternationalRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InternationalRequest.
     * @param {InternationalRequestDeleteArgs} args - Arguments to delete one InternationalRequest.
     * @example
     * // Delete one InternationalRequest
     * const InternationalRequest = await prisma.internationalRequest.delete({
     *   where: {
     *     // ... filter to delete one InternationalRequest
     *   }
     * })
     * 
     */
    delete<T extends InternationalRequestDeleteArgs>(args: SelectSubset<T, InternationalRequestDeleteArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InternationalRequest.
     * @param {InternationalRequestUpdateArgs} args - Arguments to update one InternationalRequest.
     * @example
     * // Update one InternationalRequest
     * const internationalRequest = await prisma.internationalRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InternationalRequestUpdateArgs>(args: SelectSubset<T, InternationalRequestUpdateArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InternationalRequests.
     * @param {InternationalRequestDeleteManyArgs} args - Arguments to filter InternationalRequests to delete.
     * @example
     * // Delete a few InternationalRequests
     * const { count } = await prisma.internationalRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InternationalRequestDeleteManyArgs>(args?: SelectSubset<T, InternationalRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InternationalRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InternationalRequests
     * const internationalRequest = await prisma.internationalRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InternationalRequestUpdateManyArgs>(args: SelectSubset<T, InternationalRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InternationalRequest.
     * @param {InternationalRequestUpsertArgs} args - Arguments to update or create a InternationalRequest.
     * @example
     * // Update or create a InternationalRequest
     * const internationalRequest = await prisma.internationalRequest.upsert({
     *   create: {
     *     // ... data to create a InternationalRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InternationalRequest we want to update
     *   }
     * })
     */
    upsert<T extends InternationalRequestUpsertArgs>(args: SelectSubset<T, InternationalRequestUpsertArgs<ExtArgs>>): Prisma__InternationalRequestClient<$Result.GetResult<Prisma.$InternationalRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InternationalRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestCountArgs} args - Arguments to filter InternationalRequests to count.
     * @example
     * // Count the number of InternationalRequests
     * const count = await prisma.internationalRequest.count({
     *   where: {
     *     // ... the filter for the InternationalRequests we want to count
     *   }
     * })
    **/
    count<T extends InternationalRequestCountArgs>(
      args?: Subset<T, InternationalRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InternationalRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InternationalRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InternationalRequestAggregateArgs>(args: Subset<T, InternationalRequestAggregateArgs>): Prisma.PrismaPromise<GetInternationalRequestAggregateType<T>>

    /**
     * Group by InternationalRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternationalRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InternationalRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InternationalRequestGroupByArgs['orderBy'] }
        : { orderBy?: InternationalRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InternationalRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInternationalRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InternationalRequest model
   */
  readonly fields: InternationalRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InternationalRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InternationalRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends InternationalRequest$caseArgs<ExtArgs> = {}>(args?: Subset<T, InternationalRequest$caseArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    officer<T extends InternationalRequest$officerArgs<ExtArgs> = {}>(args?: Subset<T, InternationalRequest$officerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InternationalRequest model
   */ 
  interface InternationalRequestFieldRefs {
    readonly id: FieldRef<"InternationalRequest", 'String'>
    readonly refNumber: FieldRef<"InternationalRequest", 'String'>
    readonly direction: FieldRef<"InternationalRequest", 'String'>
    readonly country: FieldRef<"InternationalRequest", 'String'>
    readonly agency: FieldRef<"InternationalRequest", 'String'>
    readonly subject: FieldRef<"InternationalRequest", 'String'>
    readonly details: FieldRef<"InternationalRequest", 'String'>
    readonly status: FieldRef<"InternationalRequest", 'String'>
    readonly priority: FieldRef<"InternationalRequest", 'String'>
    readonly caseId: FieldRef<"InternationalRequest", 'String'>
    readonly officerId: FieldRef<"InternationalRequest", 'String'>
    readonly createdAt: FieldRef<"InternationalRequest", 'DateTime'>
    readonly respondedAt: FieldRef<"InternationalRequest", 'DateTime'>
    readonly attachmentPath: FieldRef<"InternationalRequest", 'String'>
    readonly attachmentName: FieldRef<"InternationalRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * InternationalRequest findUnique
   */
  export type InternationalRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * Filter, which InternationalRequest to fetch.
     */
    where: InternationalRequestWhereUniqueInput
  }

  /**
   * InternationalRequest findUniqueOrThrow
   */
  export type InternationalRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * Filter, which InternationalRequest to fetch.
     */
    where: InternationalRequestWhereUniqueInput
  }

  /**
   * InternationalRequest findFirst
   */
  export type InternationalRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * Filter, which InternationalRequest to fetch.
     */
    where?: InternationalRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternationalRequests to fetch.
     */
    orderBy?: InternationalRequestOrderByWithRelationInput | InternationalRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InternationalRequests.
     */
    cursor?: InternationalRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternationalRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternationalRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InternationalRequests.
     */
    distinct?: InternationalRequestScalarFieldEnum | InternationalRequestScalarFieldEnum[]
  }

  /**
   * InternationalRequest findFirstOrThrow
   */
  export type InternationalRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * Filter, which InternationalRequest to fetch.
     */
    where?: InternationalRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternationalRequests to fetch.
     */
    orderBy?: InternationalRequestOrderByWithRelationInput | InternationalRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InternationalRequests.
     */
    cursor?: InternationalRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternationalRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternationalRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InternationalRequests.
     */
    distinct?: InternationalRequestScalarFieldEnum | InternationalRequestScalarFieldEnum[]
  }

  /**
   * InternationalRequest findMany
   */
  export type InternationalRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * Filter, which InternationalRequests to fetch.
     */
    where?: InternationalRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternationalRequests to fetch.
     */
    orderBy?: InternationalRequestOrderByWithRelationInput | InternationalRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InternationalRequests.
     */
    cursor?: InternationalRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternationalRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternationalRequests.
     */
    skip?: number
    distinct?: InternationalRequestScalarFieldEnum | InternationalRequestScalarFieldEnum[]
  }

  /**
   * InternationalRequest create
   */
  export type InternationalRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a InternationalRequest.
     */
    data: XOR<InternationalRequestCreateInput, InternationalRequestUncheckedCreateInput>
  }

  /**
   * InternationalRequest createMany
   */
  export type InternationalRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InternationalRequests.
     */
    data: InternationalRequestCreateManyInput | InternationalRequestCreateManyInput[]
  }

  /**
   * InternationalRequest createManyAndReturn
   */
  export type InternationalRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InternationalRequests.
     */
    data: InternationalRequestCreateManyInput | InternationalRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InternationalRequest update
   */
  export type InternationalRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a InternationalRequest.
     */
    data: XOR<InternationalRequestUpdateInput, InternationalRequestUncheckedUpdateInput>
    /**
     * Choose, which InternationalRequest to update.
     */
    where: InternationalRequestWhereUniqueInput
  }

  /**
   * InternationalRequest updateMany
   */
  export type InternationalRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InternationalRequests.
     */
    data: XOR<InternationalRequestUpdateManyMutationInput, InternationalRequestUncheckedUpdateManyInput>
    /**
     * Filter which InternationalRequests to update
     */
    where?: InternationalRequestWhereInput
  }

  /**
   * InternationalRequest upsert
   */
  export type InternationalRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the InternationalRequest to update in case it exists.
     */
    where: InternationalRequestWhereUniqueInput
    /**
     * In case the InternationalRequest found by the `where` argument doesn't exist, create a new InternationalRequest with this data.
     */
    create: XOR<InternationalRequestCreateInput, InternationalRequestUncheckedCreateInput>
    /**
     * In case the InternationalRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InternationalRequestUpdateInput, InternationalRequestUncheckedUpdateInput>
  }

  /**
   * InternationalRequest delete
   */
  export type InternationalRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
    /**
     * Filter which InternationalRequest to delete.
     */
    where: InternationalRequestWhereUniqueInput
  }

  /**
   * InternationalRequest deleteMany
   */
  export type InternationalRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InternationalRequests to delete
     */
    where?: InternationalRequestWhereInput
  }

  /**
   * InternationalRequest.case
   */
  export type InternationalRequest$caseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
  }

  /**
   * InternationalRequest.officer
   */
  export type InternationalRequest$officerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * InternationalRequest without action
   */
  export type InternationalRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternationalRequest
     */
    select?: InternationalRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InternationalRequestInclude<ExtArgs> | null
  }


  /**
   * Model ActivityReport
   */

  export type AggregateActivityReport = {
    _count: ActivityReportCountAggregateOutputType | null
    _min: ActivityReportMinAggregateOutputType | null
    _max: ActivityReportMaxAggregateOutputType | null
  }

  export type ActivityReportMinAggregateOutputType = {
    id: string | null
    weekStart: Date | null
    weekEnd: Date | null
    summary: string | null
    casesWorked: string | null
    challenges: string | null
    nextSteps: string | null
    status: string | null
    officerId: string | null
    createdAt: Date | null
  }

  export type ActivityReportMaxAggregateOutputType = {
    id: string | null
    weekStart: Date | null
    weekEnd: Date | null
    summary: string | null
    casesWorked: string | null
    challenges: string | null
    nextSteps: string | null
    status: string | null
    officerId: string | null
    createdAt: Date | null
  }

  export type ActivityReportCountAggregateOutputType = {
    id: number
    weekStart: number
    weekEnd: number
    summary: number
    casesWorked: number
    challenges: number
    nextSteps: number
    status: number
    officerId: number
    createdAt: number
    _all: number
  }


  export type ActivityReportMinAggregateInputType = {
    id?: true
    weekStart?: true
    weekEnd?: true
    summary?: true
    casesWorked?: true
    challenges?: true
    nextSteps?: true
    status?: true
    officerId?: true
    createdAt?: true
  }

  export type ActivityReportMaxAggregateInputType = {
    id?: true
    weekStart?: true
    weekEnd?: true
    summary?: true
    casesWorked?: true
    challenges?: true
    nextSteps?: true
    status?: true
    officerId?: true
    createdAt?: true
  }

  export type ActivityReportCountAggregateInputType = {
    id?: true
    weekStart?: true
    weekEnd?: true
    summary?: true
    casesWorked?: true
    challenges?: true
    nextSteps?: true
    status?: true
    officerId?: true
    createdAt?: true
    _all?: true
  }

  export type ActivityReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivityReport to aggregate.
     */
    where?: ActivityReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityReports to fetch.
     */
    orderBy?: ActivityReportOrderByWithRelationInput | ActivityReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActivityReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActivityReports
    **/
    _count?: true | ActivityReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivityReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivityReportMaxAggregateInputType
  }

  export type GetActivityReportAggregateType<T extends ActivityReportAggregateArgs> = {
        [P in keyof T & keyof AggregateActivityReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivityReport[P]>
      : GetScalarType<T[P], AggregateActivityReport[P]>
  }




  export type ActivityReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityReportWhereInput
    orderBy?: ActivityReportOrderByWithAggregationInput | ActivityReportOrderByWithAggregationInput[]
    by: ActivityReportScalarFieldEnum[] | ActivityReportScalarFieldEnum
    having?: ActivityReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivityReportCountAggregateInputType | true
    _min?: ActivityReportMinAggregateInputType
    _max?: ActivityReportMaxAggregateInputType
  }

  export type ActivityReportGroupByOutputType = {
    id: string
    weekStart: Date
    weekEnd: Date
    summary: string
    casesWorked: string | null
    challenges: string | null
    nextSteps: string | null
    status: string
    officerId: string | null
    createdAt: Date
    _count: ActivityReportCountAggregateOutputType | null
    _min: ActivityReportMinAggregateOutputType | null
    _max: ActivityReportMaxAggregateOutputType | null
  }

  type GetActivityReportGroupByPayload<T extends ActivityReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivityReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivityReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivityReportGroupByOutputType[P]>
            : GetScalarType<T[P], ActivityReportGroupByOutputType[P]>
        }
      >
    >


  export type ActivityReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weekStart?: boolean
    weekEnd?: boolean
    summary?: boolean
    casesWorked?: boolean
    challenges?: boolean
    nextSteps?: boolean
    status?: boolean
    officerId?: boolean
    createdAt?: boolean
    officer?: boolean | ActivityReport$officerArgs<ExtArgs>
  }, ExtArgs["result"]["activityReport"]>

  export type ActivityReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weekStart?: boolean
    weekEnd?: boolean
    summary?: boolean
    casesWorked?: boolean
    challenges?: boolean
    nextSteps?: boolean
    status?: boolean
    officerId?: boolean
    createdAt?: boolean
    officer?: boolean | ActivityReport$officerArgs<ExtArgs>
  }, ExtArgs["result"]["activityReport"]>

  export type ActivityReportSelectScalar = {
    id?: boolean
    weekStart?: boolean
    weekEnd?: boolean
    summary?: boolean
    casesWorked?: boolean
    challenges?: boolean
    nextSteps?: boolean
    status?: boolean
    officerId?: boolean
    createdAt?: boolean
  }

  export type ActivityReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    officer?: boolean | ActivityReport$officerArgs<ExtArgs>
  }
  export type ActivityReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    officer?: boolean | ActivityReport$officerArgs<ExtArgs>
  }

  export type $ActivityReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActivityReport"
    objects: {
      officer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weekStart: Date
      weekEnd: Date
      summary: string
      casesWorked: string | null
      challenges: string | null
      nextSteps: string | null
      status: string
      officerId: string | null
      createdAt: Date
    }, ExtArgs["result"]["activityReport"]>
    composites: {}
  }

  type ActivityReportGetPayload<S extends boolean | null | undefined | ActivityReportDefaultArgs> = $Result.GetResult<Prisma.$ActivityReportPayload, S>

  type ActivityReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActivityReportFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActivityReportCountAggregateInputType | true
    }

  export interface ActivityReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActivityReport'], meta: { name: 'ActivityReport' } }
    /**
     * Find zero or one ActivityReport that matches the filter.
     * @param {ActivityReportFindUniqueArgs} args - Arguments to find a ActivityReport
     * @example
     * // Get one ActivityReport
     * const activityReport = await prisma.activityReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActivityReportFindUniqueArgs>(args: SelectSubset<T, ActivityReportFindUniqueArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActivityReport that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActivityReportFindUniqueOrThrowArgs} args - Arguments to find a ActivityReport
     * @example
     * // Get one ActivityReport
     * const activityReport = await prisma.activityReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActivityReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ActivityReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActivityReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportFindFirstArgs} args - Arguments to find a ActivityReport
     * @example
     * // Get one ActivityReport
     * const activityReport = await prisma.activityReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActivityReportFindFirstArgs>(args?: SelectSubset<T, ActivityReportFindFirstArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActivityReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportFindFirstOrThrowArgs} args - Arguments to find a ActivityReport
     * @example
     * // Get one ActivityReport
     * const activityReport = await prisma.activityReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActivityReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ActivityReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActivityReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActivityReports
     * const activityReports = await prisma.activityReport.findMany()
     * 
     * // Get first 10 ActivityReports
     * const activityReports = await prisma.activityReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activityReportWithIdOnly = await prisma.activityReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActivityReportFindManyArgs>(args?: SelectSubset<T, ActivityReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActivityReport.
     * @param {ActivityReportCreateArgs} args - Arguments to create a ActivityReport.
     * @example
     * // Create one ActivityReport
     * const ActivityReport = await prisma.activityReport.create({
     *   data: {
     *     // ... data to create a ActivityReport
     *   }
     * })
     * 
     */
    create<T extends ActivityReportCreateArgs>(args: SelectSubset<T, ActivityReportCreateArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActivityReports.
     * @param {ActivityReportCreateManyArgs} args - Arguments to create many ActivityReports.
     * @example
     * // Create many ActivityReports
     * const activityReport = await prisma.activityReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActivityReportCreateManyArgs>(args?: SelectSubset<T, ActivityReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActivityReports and returns the data saved in the database.
     * @param {ActivityReportCreateManyAndReturnArgs} args - Arguments to create many ActivityReports.
     * @example
     * // Create many ActivityReports
     * const activityReport = await prisma.activityReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActivityReports and only return the `id`
     * const activityReportWithIdOnly = await prisma.activityReport.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActivityReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ActivityReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActivityReport.
     * @param {ActivityReportDeleteArgs} args - Arguments to delete one ActivityReport.
     * @example
     * // Delete one ActivityReport
     * const ActivityReport = await prisma.activityReport.delete({
     *   where: {
     *     // ... filter to delete one ActivityReport
     *   }
     * })
     * 
     */
    delete<T extends ActivityReportDeleteArgs>(args: SelectSubset<T, ActivityReportDeleteArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActivityReport.
     * @param {ActivityReportUpdateArgs} args - Arguments to update one ActivityReport.
     * @example
     * // Update one ActivityReport
     * const activityReport = await prisma.activityReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActivityReportUpdateArgs>(args: SelectSubset<T, ActivityReportUpdateArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActivityReports.
     * @param {ActivityReportDeleteManyArgs} args - Arguments to filter ActivityReports to delete.
     * @example
     * // Delete a few ActivityReports
     * const { count } = await prisma.activityReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActivityReportDeleteManyArgs>(args?: SelectSubset<T, ActivityReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActivityReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActivityReports
     * const activityReport = await prisma.activityReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActivityReportUpdateManyArgs>(args: SelectSubset<T, ActivityReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActivityReport.
     * @param {ActivityReportUpsertArgs} args - Arguments to update or create a ActivityReport.
     * @example
     * // Update or create a ActivityReport
     * const activityReport = await prisma.activityReport.upsert({
     *   create: {
     *     // ... data to create a ActivityReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActivityReport we want to update
     *   }
     * })
     */
    upsert<T extends ActivityReportUpsertArgs>(args: SelectSubset<T, ActivityReportUpsertArgs<ExtArgs>>): Prisma__ActivityReportClient<$Result.GetResult<Prisma.$ActivityReportPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActivityReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportCountArgs} args - Arguments to filter ActivityReports to count.
     * @example
     * // Count the number of ActivityReports
     * const count = await prisma.activityReport.count({
     *   where: {
     *     // ... the filter for the ActivityReports we want to count
     *   }
     * })
    **/
    count<T extends ActivityReportCountArgs>(
      args?: Subset<T, ActivityReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivityReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActivityReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActivityReportAggregateArgs>(args: Subset<T, ActivityReportAggregateArgs>): Prisma.PrismaPromise<GetActivityReportAggregateType<T>>

    /**
     * Group by ActivityReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActivityReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActivityReportGroupByArgs['orderBy'] }
        : { orderBy?: ActivityReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActivityReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActivityReport model
   */
  readonly fields: ActivityReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActivityReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActivityReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    officer<T extends ActivityReport$officerArgs<ExtArgs> = {}>(args?: Subset<T, ActivityReport$officerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActivityReport model
   */ 
  interface ActivityReportFieldRefs {
    readonly id: FieldRef<"ActivityReport", 'String'>
    readonly weekStart: FieldRef<"ActivityReport", 'DateTime'>
    readonly weekEnd: FieldRef<"ActivityReport", 'DateTime'>
    readonly summary: FieldRef<"ActivityReport", 'String'>
    readonly casesWorked: FieldRef<"ActivityReport", 'String'>
    readonly challenges: FieldRef<"ActivityReport", 'String'>
    readonly nextSteps: FieldRef<"ActivityReport", 'String'>
    readonly status: FieldRef<"ActivityReport", 'String'>
    readonly officerId: FieldRef<"ActivityReport", 'String'>
    readonly createdAt: FieldRef<"ActivityReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActivityReport findUnique
   */
  export type ActivityReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * Filter, which ActivityReport to fetch.
     */
    where: ActivityReportWhereUniqueInput
  }

  /**
   * ActivityReport findUniqueOrThrow
   */
  export type ActivityReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * Filter, which ActivityReport to fetch.
     */
    where: ActivityReportWhereUniqueInput
  }

  /**
   * ActivityReport findFirst
   */
  export type ActivityReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * Filter, which ActivityReport to fetch.
     */
    where?: ActivityReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityReports to fetch.
     */
    orderBy?: ActivityReportOrderByWithRelationInput | ActivityReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivityReports.
     */
    cursor?: ActivityReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivityReports.
     */
    distinct?: ActivityReportScalarFieldEnum | ActivityReportScalarFieldEnum[]
  }

  /**
   * ActivityReport findFirstOrThrow
   */
  export type ActivityReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * Filter, which ActivityReport to fetch.
     */
    where?: ActivityReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityReports to fetch.
     */
    orderBy?: ActivityReportOrderByWithRelationInput | ActivityReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivityReports.
     */
    cursor?: ActivityReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivityReports.
     */
    distinct?: ActivityReportScalarFieldEnum | ActivityReportScalarFieldEnum[]
  }

  /**
   * ActivityReport findMany
   */
  export type ActivityReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * Filter, which ActivityReports to fetch.
     */
    where?: ActivityReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityReports to fetch.
     */
    orderBy?: ActivityReportOrderByWithRelationInput | ActivityReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActivityReports.
     */
    cursor?: ActivityReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityReports.
     */
    skip?: number
    distinct?: ActivityReportScalarFieldEnum | ActivityReportScalarFieldEnum[]
  }

  /**
   * ActivityReport create
   */
  export type ActivityReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * The data needed to create a ActivityReport.
     */
    data: XOR<ActivityReportCreateInput, ActivityReportUncheckedCreateInput>
  }

  /**
   * ActivityReport createMany
   */
  export type ActivityReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActivityReports.
     */
    data: ActivityReportCreateManyInput | ActivityReportCreateManyInput[]
  }

  /**
   * ActivityReport createManyAndReturn
   */
  export type ActivityReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActivityReports.
     */
    data: ActivityReportCreateManyInput | ActivityReportCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActivityReport update
   */
  export type ActivityReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * The data needed to update a ActivityReport.
     */
    data: XOR<ActivityReportUpdateInput, ActivityReportUncheckedUpdateInput>
    /**
     * Choose, which ActivityReport to update.
     */
    where: ActivityReportWhereUniqueInput
  }

  /**
   * ActivityReport updateMany
   */
  export type ActivityReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActivityReports.
     */
    data: XOR<ActivityReportUpdateManyMutationInput, ActivityReportUncheckedUpdateManyInput>
    /**
     * Filter which ActivityReports to update
     */
    where?: ActivityReportWhereInput
  }

  /**
   * ActivityReport upsert
   */
  export type ActivityReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * The filter to search for the ActivityReport to update in case it exists.
     */
    where: ActivityReportWhereUniqueInput
    /**
     * In case the ActivityReport found by the `where` argument doesn't exist, create a new ActivityReport with this data.
     */
    create: XOR<ActivityReportCreateInput, ActivityReportUncheckedCreateInput>
    /**
     * In case the ActivityReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActivityReportUpdateInput, ActivityReportUncheckedUpdateInput>
  }

  /**
   * ActivityReport delete
   */
  export type ActivityReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
    /**
     * Filter which ActivityReport to delete.
     */
    where: ActivityReportWhereUniqueInput
  }

  /**
   * ActivityReport deleteMany
   */
  export type ActivityReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivityReports to delete
     */
    where?: ActivityReportWhereInput
  }

  /**
   * ActivityReport.officer
   */
  export type ActivityReport$officerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ActivityReport without action
   */
  export type ActivityReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityReport
     */
    select?: ActivityReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityReportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    approved: 'approved',
    deactivated: 'deactivated',
    cdrAccess: 'cdrAccess',
    lastActive: 'lastActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CaseScalarFieldEnum: {
    id: 'id',
    caseNumber: 'caseNumber',
    title: 'title',
    category: 'category',
    status: 'status',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    closedAt: 'closedAt',
    closureReason: 'closureReason',
    officerId: 'officerId'
  };

  export type CaseScalarFieldEnum = (typeof CaseScalarFieldEnum)[keyof typeof CaseScalarFieldEnum]


  export const JournalEntryScalarFieldEnum: {
    id: 'id',
    dayNumber: 'dayNumber',
    content: 'content',
    actions: 'actions',
    createdAt: 'createdAt',
    caseId: 'caseId',
    authorId: 'authorId'
  };

  export type JournalEntryScalarFieldEnum = (typeof JournalEntryScalarFieldEnum)[keyof typeof JournalEntryScalarFieldEnum]


  export const CaseActivityScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    userId: 'userId',
    userName: 'userName',
    action: 'action',
    detail: 'detail',
    createdAt: 'createdAt'
  };

  export type CaseActivityScalarFieldEnum = (typeof CaseActivityScalarFieldEnum)[keyof typeof CaseActivityScalarFieldEnum]


  export const CdrRequestScalarFieldEnum: {
    id: 'id',
    phoneNumber: 'phoneNumber',
    telco: 'telco',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    reason: 'reason',
    status: 'status',
    requestedAt: 'requestedAt',
    receivedAt: 'receivedAt',
    caseId: 'caseId',
    officerId: 'officerId',
    attachmentPath: 'attachmentPath',
    attachmentName: 'attachmentName'
  };

  export type CdrRequestScalarFieldEnum = (typeof CdrRequestScalarFieldEnum)[keyof typeof CdrRequestScalarFieldEnum]


  export const InternationalRequestScalarFieldEnum: {
    id: 'id',
    refNumber: 'refNumber',
    direction: 'direction',
    country: 'country',
    agency: 'agency',
    subject: 'subject',
    details: 'details',
    status: 'status',
    priority: 'priority',
    caseId: 'caseId',
    officerId: 'officerId',
    createdAt: 'createdAt',
    respondedAt: 'respondedAt',
    attachmentPath: 'attachmentPath',
    attachmentName: 'attachmentName'
  };

  export type InternationalRequestScalarFieldEnum = (typeof InternationalRequestScalarFieldEnum)[keyof typeof InternationalRequestScalarFieldEnum]


  export const ActivityReportScalarFieldEnum: {
    id: 'id',
    weekStart: 'weekStart',
    weekEnd: 'weekEnd',
    summary: 'summary',
    casesWorked: 'casesWorked',
    challenges: 'challenges',
    nextSteps: 'nextSteps',
    status: 'status',
    officerId: 'officerId',
    createdAt: 'createdAt'
  };

  export type ActivityReportScalarFieldEnum = (typeof ActivityReportScalarFieldEnum)[keyof typeof ActivityReportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    approved?: BoolFilter<"User"> | boolean
    deactivated?: BoolFilter<"User"> | boolean
    cdrAccess?: BoolFilter<"User"> | boolean
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    cases?: CaseListRelationFilter
    entries?: JournalEntryListRelationFilter
    cdrRequests?: CdrRequestListRelationFilter
    internationalRequests?: InternationalRequestListRelationFilter
    activityReports?: ActivityReportListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    approved?: SortOrder
    deactivated?: SortOrder
    cdrAccess?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cases?: CaseOrderByRelationAggregateInput
    entries?: JournalEntryOrderByRelationAggregateInput
    cdrRequests?: CdrRequestOrderByRelationAggregateInput
    internationalRequests?: InternationalRequestOrderByRelationAggregateInput
    activityReports?: ActivityReportOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    approved?: BoolFilter<"User"> | boolean
    deactivated?: BoolFilter<"User"> | boolean
    cdrAccess?: BoolFilter<"User"> | boolean
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    cases?: CaseListRelationFilter
    entries?: JournalEntryListRelationFilter
    cdrRequests?: CdrRequestListRelationFilter
    internationalRequests?: InternationalRequestListRelationFilter
    activityReports?: ActivityReportListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    approved?: SortOrder
    deactivated?: SortOrder
    cdrAccess?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    approved?: BoolWithAggregatesFilter<"User"> | boolean
    deactivated?: BoolWithAggregatesFilter<"User"> | boolean
    cdrAccess?: BoolWithAggregatesFilter<"User"> | boolean
    lastActive?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CaseWhereInput = {
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    id?: StringFilter<"Case"> | string
    caseNumber?: StringFilter<"Case"> | string
    title?: StringFilter<"Case"> | string
    category?: StringFilter<"Case"> | string
    status?: StringFilter<"Case"> | string
    description?: StringNullableFilter<"Case"> | string | null
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    closedAt?: DateTimeNullableFilter<"Case"> | Date | string | null
    closureReason?: StringNullableFilter<"Case"> | string | null
    officerId?: StringNullableFilter<"Case"> | string | null
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    entries?: JournalEntryListRelationFilter
    cdrRequests?: CdrRequestListRelationFilter
    internationalRequests?: InternationalRequestListRelationFilter
    caseActivities?: CaseActivityListRelationFilter
  }

  export type CaseOrderByWithRelationInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    title?: SortOrder
    category?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedAt?: SortOrderInput | SortOrder
    closureReason?: SortOrderInput | SortOrder
    officerId?: SortOrderInput | SortOrder
    officer?: UserOrderByWithRelationInput
    entries?: JournalEntryOrderByRelationAggregateInput
    cdrRequests?: CdrRequestOrderByRelationAggregateInput
    internationalRequests?: InternationalRequestOrderByRelationAggregateInput
    caseActivities?: CaseActivityOrderByRelationAggregateInput
  }

  export type CaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    caseNumber?: string
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    title?: StringFilter<"Case"> | string
    category?: StringFilter<"Case"> | string
    status?: StringFilter<"Case"> | string
    description?: StringNullableFilter<"Case"> | string | null
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    closedAt?: DateTimeNullableFilter<"Case"> | Date | string | null
    closureReason?: StringNullableFilter<"Case"> | string | null
    officerId?: StringNullableFilter<"Case"> | string | null
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    entries?: JournalEntryListRelationFilter
    cdrRequests?: CdrRequestListRelationFilter
    internationalRequests?: InternationalRequestListRelationFilter
    caseActivities?: CaseActivityListRelationFilter
  }, "id" | "caseNumber">

  export type CaseOrderByWithAggregationInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    title?: SortOrder
    category?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedAt?: SortOrderInput | SortOrder
    closureReason?: SortOrderInput | SortOrder
    officerId?: SortOrderInput | SortOrder
    _count?: CaseCountOrderByAggregateInput
    _max?: CaseMaxOrderByAggregateInput
    _min?: CaseMinOrderByAggregateInput
  }

  export type CaseScalarWhereWithAggregatesInput = {
    AND?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    OR?: CaseScalarWhereWithAggregatesInput[]
    NOT?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Case"> | string
    caseNumber?: StringWithAggregatesFilter<"Case"> | string
    title?: StringWithAggregatesFilter<"Case"> | string
    category?: StringWithAggregatesFilter<"Case"> | string
    status?: StringWithAggregatesFilter<"Case"> | string
    description?: StringNullableWithAggregatesFilter<"Case"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    closedAt?: DateTimeNullableWithAggregatesFilter<"Case"> | Date | string | null
    closureReason?: StringNullableWithAggregatesFilter<"Case"> | string | null
    officerId?: StringNullableWithAggregatesFilter<"Case"> | string | null
  }

  export type JournalEntryWhereInput = {
    AND?: JournalEntryWhereInput | JournalEntryWhereInput[]
    OR?: JournalEntryWhereInput[]
    NOT?: JournalEntryWhereInput | JournalEntryWhereInput[]
    id?: StringFilter<"JournalEntry"> | string
    dayNumber?: IntFilter<"JournalEntry"> | number
    content?: StringFilter<"JournalEntry"> | string
    actions?: StringNullableFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    caseId?: StringFilter<"JournalEntry"> | string
    authorId?: StringNullableFilter<"JournalEntry"> | string | null
    case?: XOR<CaseRelationFilter, CaseWhereInput>
    author?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type JournalEntryOrderByWithRelationInput = {
    id?: SortOrder
    dayNumber?: SortOrder
    content?: SortOrder
    actions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    caseId?: SortOrder
    authorId?: SortOrderInput | SortOrder
    case?: CaseOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
  }

  export type JournalEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JournalEntryWhereInput | JournalEntryWhereInput[]
    OR?: JournalEntryWhereInput[]
    NOT?: JournalEntryWhereInput | JournalEntryWhereInput[]
    dayNumber?: IntFilter<"JournalEntry"> | number
    content?: StringFilter<"JournalEntry"> | string
    actions?: StringNullableFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    caseId?: StringFilter<"JournalEntry"> | string
    authorId?: StringNullableFilter<"JournalEntry"> | string | null
    case?: XOR<CaseRelationFilter, CaseWhereInput>
    author?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type JournalEntryOrderByWithAggregationInput = {
    id?: SortOrder
    dayNumber?: SortOrder
    content?: SortOrder
    actions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    caseId?: SortOrder
    authorId?: SortOrderInput | SortOrder
    _count?: JournalEntryCountOrderByAggregateInput
    _avg?: JournalEntryAvgOrderByAggregateInput
    _max?: JournalEntryMaxOrderByAggregateInput
    _min?: JournalEntryMinOrderByAggregateInput
    _sum?: JournalEntrySumOrderByAggregateInput
  }

  export type JournalEntryScalarWhereWithAggregatesInput = {
    AND?: JournalEntryScalarWhereWithAggregatesInput | JournalEntryScalarWhereWithAggregatesInput[]
    OR?: JournalEntryScalarWhereWithAggregatesInput[]
    NOT?: JournalEntryScalarWhereWithAggregatesInput | JournalEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JournalEntry"> | string
    dayNumber?: IntWithAggregatesFilter<"JournalEntry"> | number
    content?: StringWithAggregatesFilter<"JournalEntry"> | string
    actions?: StringNullableWithAggregatesFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string
    caseId?: StringWithAggregatesFilter<"JournalEntry"> | string
    authorId?: StringNullableWithAggregatesFilter<"JournalEntry"> | string | null
  }

  export type CaseActivityWhereInput = {
    AND?: CaseActivityWhereInput | CaseActivityWhereInput[]
    OR?: CaseActivityWhereInput[]
    NOT?: CaseActivityWhereInput | CaseActivityWhereInput[]
    id?: StringFilter<"CaseActivity"> | string
    caseId?: StringFilter<"CaseActivity"> | string
    userId?: StringNullableFilter<"CaseActivity"> | string | null
    userName?: StringFilter<"CaseActivity"> | string
    action?: StringFilter<"CaseActivity"> | string
    detail?: StringNullableFilter<"CaseActivity"> | string | null
    createdAt?: DateTimeFilter<"CaseActivity"> | Date | string
    case?: XOR<CaseRelationFilter, CaseWhereInput>
  }

  export type CaseActivityOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    userId?: SortOrderInput | SortOrder
    userName?: SortOrder
    action?: SortOrder
    detail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    case?: CaseOrderByWithRelationInput
  }

  export type CaseActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CaseActivityWhereInput | CaseActivityWhereInput[]
    OR?: CaseActivityWhereInput[]
    NOT?: CaseActivityWhereInput | CaseActivityWhereInput[]
    caseId?: StringFilter<"CaseActivity"> | string
    userId?: StringNullableFilter<"CaseActivity"> | string | null
    userName?: StringFilter<"CaseActivity"> | string
    action?: StringFilter<"CaseActivity"> | string
    detail?: StringNullableFilter<"CaseActivity"> | string | null
    createdAt?: DateTimeFilter<"CaseActivity"> | Date | string
    case?: XOR<CaseRelationFilter, CaseWhereInput>
  }, "id">

  export type CaseActivityOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    userId?: SortOrderInput | SortOrder
    userName?: SortOrder
    action?: SortOrder
    detail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CaseActivityCountOrderByAggregateInput
    _max?: CaseActivityMaxOrderByAggregateInput
    _min?: CaseActivityMinOrderByAggregateInput
  }

  export type CaseActivityScalarWhereWithAggregatesInput = {
    AND?: CaseActivityScalarWhereWithAggregatesInput | CaseActivityScalarWhereWithAggregatesInput[]
    OR?: CaseActivityScalarWhereWithAggregatesInput[]
    NOT?: CaseActivityScalarWhereWithAggregatesInput | CaseActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CaseActivity"> | string
    caseId?: StringWithAggregatesFilter<"CaseActivity"> | string
    userId?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    userName?: StringWithAggregatesFilter<"CaseActivity"> | string
    action?: StringWithAggregatesFilter<"CaseActivity"> | string
    detail?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CaseActivity"> | Date | string
  }

  export type CdrRequestWhereInput = {
    AND?: CdrRequestWhereInput | CdrRequestWhereInput[]
    OR?: CdrRequestWhereInput[]
    NOT?: CdrRequestWhereInput | CdrRequestWhereInput[]
    id?: StringFilter<"CdrRequest"> | string
    phoneNumber?: StringFilter<"CdrRequest"> | string
    telco?: StringFilter<"CdrRequest"> | string
    periodStart?: DateTimeFilter<"CdrRequest"> | Date | string
    periodEnd?: DateTimeFilter<"CdrRequest"> | Date | string
    reason?: StringFilter<"CdrRequest"> | string
    status?: StringFilter<"CdrRequest"> | string
    requestedAt?: DateTimeFilter<"CdrRequest"> | Date | string
    receivedAt?: DateTimeNullableFilter<"CdrRequest"> | Date | string | null
    caseId?: StringNullableFilter<"CdrRequest"> | string | null
    officerId?: StringNullableFilter<"CdrRequest"> | string | null
    attachmentPath?: StringNullableFilter<"CdrRequest"> | string | null
    attachmentName?: StringNullableFilter<"CdrRequest"> | string | null
    case?: XOR<CaseNullableRelationFilter, CaseWhereInput> | null
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type CdrRequestOrderByWithRelationInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    telco?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    receivedAt?: SortOrderInput | SortOrder
    caseId?: SortOrderInput | SortOrder
    officerId?: SortOrderInput | SortOrder
    attachmentPath?: SortOrderInput | SortOrder
    attachmentName?: SortOrderInput | SortOrder
    case?: CaseOrderByWithRelationInput
    officer?: UserOrderByWithRelationInput
  }

  export type CdrRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CdrRequestWhereInput | CdrRequestWhereInput[]
    OR?: CdrRequestWhereInput[]
    NOT?: CdrRequestWhereInput | CdrRequestWhereInput[]
    phoneNumber?: StringFilter<"CdrRequest"> | string
    telco?: StringFilter<"CdrRequest"> | string
    periodStart?: DateTimeFilter<"CdrRequest"> | Date | string
    periodEnd?: DateTimeFilter<"CdrRequest"> | Date | string
    reason?: StringFilter<"CdrRequest"> | string
    status?: StringFilter<"CdrRequest"> | string
    requestedAt?: DateTimeFilter<"CdrRequest"> | Date | string
    receivedAt?: DateTimeNullableFilter<"CdrRequest"> | Date | string | null
    caseId?: StringNullableFilter<"CdrRequest"> | string | null
    officerId?: StringNullableFilter<"CdrRequest"> | string | null
    attachmentPath?: StringNullableFilter<"CdrRequest"> | string | null
    attachmentName?: StringNullableFilter<"CdrRequest"> | string | null
    case?: XOR<CaseNullableRelationFilter, CaseWhereInput> | null
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type CdrRequestOrderByWithAggregationInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    telco?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    receivedAt?: SortOrderInput | SortOrder
    caseId?: SortOrderInput | SortOrder
    officerId?: SortOrderInput | SortOrder
    attachmentPath?: SortOrderInput | SortOrder
    attachmentName?: SortOrderInput | SortOrder
    _count?: CdrRequestCountOrderByAggregateInput
    _max?: CdrRequestMaxOrderByAggregateInput
    _min?: CdrRequestMinOrderByAggregateInput
  }

  export type CdrRequestScalarWhereWithAggregatesInput = {
    AND?: CdrRequestScalarWhereWithAggregatesInput | CdrRequestScalarWhereWithAggregatesInput[]
    OR?: CdrRequestScalarWhereWithAggregatesInput[]
    NOT?: CdrRequestScalarWhereWithAggregatesInput | CdrRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CdrRequest"> | string
    phoneNumber?: StringWithAggregatesFilter<"CdrRequest"> | string
    telco?: StringWithAggregatesFilter<"CdrRequest"> | string
    periodStart?: DateTimeWithAggregatesFilter<"CdrRequest"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"CdrRequest"> | Date | string
    reason?: StringWithAggregatesFilter<"CdrRequest"> | string
    status?: StringWithAggregatesFilter<"CdrRequest"> | string
    requestedAt?: DateTimeWithAggregatesFilter<"CdrRequest"> | Date | string
    receivedAt?: DateTimeNullableWithAggregatesFilter<"CdrRequest"> | Date | string | null
    caseId?: StringNullableWithAggregatesFilter<"CdrRequest"> | string | null
    officerId?: StringNullableWithAggregatesFilter<"CdrRequest"> | string | null
    attachmentPath?: StringNullableWithAggregatesFilter<"CdrRequest"> | string | null
    attachmentName?: StringNullableWithAggregatesFilter<"CdrRequest"> | string | null
  }

  export type InternationalRequestWhereInput = {
    AND?: InternationalRequestWhereInput | InternationalRequestWhereInput[]
    OR?: InternationalRequestWhereInput[]
    NOT?: InternationalRequestWhereInput | InternationalRequestWhereInput[]
    id?: StringFilter<"InternationalRequest"> | string
    refNumber?: StringFilter<"InternationalRequest"> | string
    direction?: StringFilter<"InternationalRequest"> | string
    country?: StringFilter<"InternationalRequest"> | string
    agency?: StringFilter<"InternationalRequest"> | string
    subject?: StringFilter<"InternationalRequest"> | string
    details?: StringNullableFilter<"InternationalRequest"> | string | null
    status?: StringFilter<"InternationalRequest"> | string
    priority?: StringFilter<"InternationalRequest"> | string
    caseId?: StringNullableFilter<"InternationalRequest"> | string | null
    officerId?: StringNullableFilter<"InternationalRequest"> | string | null
    createdAt?: DateTimeFilter<"InternationalRequest"> | Date | string
    respondedAt?: DateTimeNullableFilter<"InternationalRequest"> | Date | string | null
    attachmentPath?: StringNullableFilter<"InternationalRequest"> | string | null
    attachmentName?: StringNullableFilter<"InternationalRequest"> | string | null
    case?: XOR<CaseNullableRelationFilter, CaseWhereInput> | null
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type InternationalRequestOrderByWithRelationInput = {
    id?: SortOrder
    refNumber?: SortOrder
    direction?: SortOrder
    country?: SortOrder
    agency?: SortOrder
    subject?: SortOrder
    details?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    caseId?: SortOrderInput | SortOrder
    officerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    respondedAt?: SortOrderInput | SortOrder
    attachmentPath?: SortOrderInput | SortOrder
    attachmentName?: SortOrderInput | SortOrder
    case?: CaseOrderByWithRelationInput
    officer?: UserOrderByWithRelationInput
  }

  export type InternationalRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    refNumber?: string
    AND?: InternationalRequestWhereInput | InternationalRequestWhereInput[]
    OR?: InternationalRequestWhereInput[]
    NOT?: InternationalRequestWhereInput | InternationalRequestWhereInput[]
    direction?: StringFilter<"InternationalRequest"> | string
    country?: StringFilter<"InternationalRequest"> | string
    agency?: StringFilter<"InternationalRequest"> | string
    subject?: StringFilter<"InternationalRequest"> | string
    details?: StringNullableFilter<"InternationalRequest"> | string | null
    status?: StringFilter<"InternationalRequest"> | string
    priority?: StringFilter<"InternationalRequest"> | string
    caseId?: StringNullableFilter<"InternationalRequest"> | string | null
    officerId?: StringNullableFilter<"InternationalRequest"> | string | null
    createdAt?: DateTimeFilter<"InternationalRequest"> | Date | string
    respondedAt?: DateTimeNullableFilter<"InternationalRequest"> | Date | string | null
    attachmentPath?: StringNullableFilter<"InternationalRequest"> | string | null
    attachmentName?: StringNullableFilter<"InternationalRequest"> | string | null
    case?: XOR<CaseNullableRelationFilter, CaseWhereInput> | null
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "refNumber">

  export type InternationalRequestOrderByWithAggregationInput = {
    id?: SortOrder
    refNumber?: SortOrder
    direction?: SortOrder
    country?: SortOrder
    agency?: SortOrder
    subject?: SortOrder
    details?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    caseId?: SortOrderInput | SortOrder
    officerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    respondedAt?: SortOrderInput | SortOrder
    attachmentPath?: SortOrderInput | SortOrder
    attachmentName?: SortOrderInput | SortOrder
    _count?: InternationalRequestCountOrderByAggregateInput
    _max?: InternationalRequestMaxOrderByAggregateInput
    _min?: InternationalRequestMinOrderByAggregateInput
  }

  export type InternationalRequestScalarWhereWithAggregatesInput = {
    AND?: InternationalRequestScalarWhereWithAggregatesInput | InternationalRequestScalarWhereWithAggregatesInput[]
    OR?: InternationalRequestScalarWhereWithAggregatesInput[]
    NOT?: InternationalRequestScalarWhereWithAggregatesInput | InternationalRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InternationalRequest"> | string
    refNumber?: StringWithAggregatesFilter<"InternationalRequest"> | string
    direction?: StringWithAggregatesFilter<"InternationalRequest"> | string
    country?: StringWithAggregatesFilter<"InternationalRequest"> | string
    agency?: StringWithAggregatesFilter<"InternationalRequest"> | string
    subject?: StringWithAggregatesFilter<"InternationalRequest"> | string
    details?: StringNullableWithAggregatesFilter<"InternationalRequest"> | string | null
    status?: StringWithAggregatesFilter<"InternationalRequest"> | string
    priority?: StringWithAggregatesFilter<"InternationalRequest"> | string
    caseId?: StringNullableWithAggregatesFilter<"InternationalRequest"> | string | null
    officerId?: StringNullableWithAggregatesFilter<"InternationalRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InternationalRequest"> | Date | string
    respondedAt?: DateTimeNullableWithAggregatesFilter<"InternationalRequest"> | Date | string | null
    attachmentPath?: StringNullableWithAggregatesFilter<"InternationalRequest"> | string | null
    attachmentName?: StringNullableWithAggregatesFilter<"InternationalRequest"> | string | null
  }

  export type ActivityReportWhereInput = {
    AND?: ActivityReportWhereInput | ActivityReportWhereInput[]
    OR?: ActivityReportWhereInput[]
    NOT?: ActivityReportWhereInput | ActivityReportWhereInput[]
    id?: StringFilter<"ActivityReport"> | string
    weekStart?: DateTimeFilter<"ActivityReport"> | Date | string
    weekEnd?: DateTimeFilter<"ActivityReport"> | Date | string
    summary?: StringFilter<"ActivityReport"> | string
    casesWorked?: StringNullableFilter<"ActivityReport"> | string | null
    challenges?: StringNullableFilter<"ActivityReport"> | string | null
    nextSteps?: StringNullableFilter<"ActivityReport"> | string | null
    status?: StringFilter<"ActivityReport"> | string
    officerId?: StringNullableFilter<"ActivityReport"> | string | null
    createdAt?: DateTimeFilter<"ActivityReport"> | Date | string
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type ActivityReportOrderByWithRelationInput = {
    id?: SortOrder
    weekStart?: SortOrder
    weekEnd?: SortOrder
    summary?: SortOrder
    casesWorked?: SortOrderInput | SortOrder
    challenges?: SortOrderInput | SortOrder
    nextSteps?: SortOrderInput | SortOrder
    status?: SortOrder
    officerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    officer?: UserOrderByWithRelationInput
  }

  export type ActivityReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActivityReportWhereInput | ActivityReportWhereInput[]
    OR?: ActivityReportWhereInput[]
    NOT?: ActivityReportWhereInput | ActivityReportWhereInput[]
    weekStart?: DateTimeFilter<"ActivityReport"> | Date | string
    weekEnd?: DateTimeFilter<"ActivityReport"> | Date | string
    summary?: StringFilter<"ActivityReport"> | string
    casesWorked?: StringNullableFilter<"ActivityReport"> | string | null
    challenges?: StringNullableFilter<"ActivityReport"> | string | null
    nextSteps?: StringNullableFilter<"ActivityReport"> | string | null
    status?: StringFilter<"ActivityReport"> | string
    officerId?: StringNullableFilter<"ActivityReport"> | string | null
    createdAt?: DateTimeFilter<"ActivityReport"> | Date | string
    officer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type ActivityReportOrderByWithAggregationInput = {
    id?: SortOrder
    weekStart?: SortOrder
    weekEnd?: SortOrder
    summary?: SortOrder
    casesWorked?: SortOrderInput | SortOrder
    challenges?: SortOrderInput | SortOrder
    nextSteps?: SortOrderInput | SortOrder
    status?: SortOrder
    officerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ActivityReportCountOrderByAggregateInput
    _max?: ActivityReportMaxOrderByAggregateInput
    _min?: ActivityReportMinOrderByAggregateInput
  }

  export type ActivityReportScalarWhereWithAggregatesInput = {
    AND?: ActivityReportScalarWhereWithAggregatesInput | ActivityReportScalarWhereWithAggregatesInput[]
    OR?: ActivityReportScalarWhereWithAggregatesInput[]
    NOT?: ActivityReportScalarWhereWithAggregatesInput | ActivityReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActivityReport"> | string
    weekStart?: DateTimeWithAggregatesFilter<"ActivityReport"> | Date | string
    weekEnd?: DateTimeWithAggregatesFilter<"ActivityReport"> | Date | string
    summary?: StringWithAggregatesFilter<"ActivityReport"> | string
    casesWorked?: StringNullableWithAggregatesFilter<"ActivityReport"> | string | null
    challenges?: StringNullableWithAggregatesFilter<"ActivityReport"> | string | null
    nextSteps?: StringNullableWithAggregatesFilter<"ActivityReport"> | string | null
    status?: StringWithAggregatesFilter<"ActivityReport"> | string
    officerId?: StringNullableWithAggregatesFilter<"ActivityReport"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ActivityReport"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportCreateNestedManyWithoutOfficerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportUncheckedCreateNestedManyWithoutOfficerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUpdateManyWithoutOfficerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUncheckedUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUncheckedUpdateManyWithoutOfficerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseCreateInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officer?: UserCreateNestedOneWithoutCasesInput
    entries?: JournalEntryCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officerId?: string | null
    entries?: JournalEntryUncheckedCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutCasesNestedInput
    entries?: JournalEntryUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    entries?: JournalEntryUncheckedUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseCreateManyInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officerId?: string | null
  }

  export type CaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JournalEntryCreateInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    case: CaseCreateNestedOneWithoutEntriesInput
    author?: UserCreateNestedOneWithoutEntriesInput
  }

  export type JournalEntryUncheckedCreateInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    caseId: string
    authorId?: string | null
  }

  export type JournalEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutEntriesNestedInput
    author?: UserUpdateOneWithoutEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JournalEntryCreateManyInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    caseId: string
    authorId?: string | null
  }

  export type JournalEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityCreateInput = {
    id?: string
    userId?: string | null
    userName: string
    action: string
    detail?: string | null
    createdAt?: Date | string
    case: CaseCreateNestedOneWithoutCaseActivitiesInput
  }

  export type CaseActivityUncheckedCreateInput = {
    id?: string
    caseId: string
    userId?: string | null
    userName: string
    action: string
    detail?: string | null
    createdAt?: Date | string
  }

  export type CaseActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutCaseActivitiesNestedInput
  }

  export type CaseActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseActivityCreateManyInput = {
    id?: string
    caseId: string
    userId?: string | null
    userName: string
    action: string
    detail?: string | null
    createdAt?: Date | string
  }

  export type CaseActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CdrRequestCreateInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
    case?: CaseCreateNestedOneWithoutCdrRequestsInput
    officer?: UserCreateNestedOneWithoutCdrRequestsInput
  }

  export type CdrRequestUncheckedCreateInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    caseId?: string | null
    officerId?: string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type CdrRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneWithoutCdrRequestsNestedInput
    officer?: UserUpdateOneWithoutCdrRequestsNestedInput
  }

  export type CdrRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CdrRequestCreateManyInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    caseId?: string | null
    officerId?: string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type CdrRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CdrRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestCreateInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
    case?: CaseCreateNestedOneWithoutInternationalRequestsInput
    officer?: UserCreateNestedOneWithoutInternationalRequestsInput
  }

  export type InternationalRequestUncheckedCreateInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    caseId?: string | null
    officerId?: string | null
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type InternationalRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneWithoutInternationalRequestsNestedInput
    officer?: UserUpdateOneWithoutInternationalRequestsNestedInput
  }

  export type InternationalRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestCreateManyInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    caseId?: string | null
    officerId?: string | null
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type InternationalRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActivityReportCreateInput = {
    id?: string
    weekStart: Date | string
    weekEnd: Date | string
    summary: string
    casesWorked?: string | null
    challenges?: string | null
    nextSteps?: string | null
    status?: string
    createdAt?: Date | string
    officer?: UserCreateNestedOneWithoutActivityReportsInput
  }

  export type ActivityReportUncheckedCreateInput = {
    id?: string
    weekStart: Date | string
    weekEnd: Date | string
    summary: string
    casesWorked?: string | null
    challenges?: string | null
    nextSteps?: string | null
    status?: string
    officerId?: string | null
    createdAt?: Date | string
  }

  export type ActivityReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    officer?: UserUpdateOneWithoutActivityReportsNestedInput
  }

  export type ActivityReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityReportCreateManyInput = {
    id?: string
    weekStart: Date | string
    weekEnd: Date | string
    summary: string
    casesWorked?: string | null
    challenges?: string | null
    nextSteps?: string | null
    status?: string
    officerId?: string | null
    createdAt?: Date | string
  }

  export type ActivityReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CaseListRelationFilter = {
    every?: CaseWhereInput
    some?: CaseWhereInput
    none?: CaseWhereInput
  }

  export type JournalEntryListRelationFilter = {
    every?: JournalEntryWhereInput
    some?: JournalEntryWhereInput
    none?: JournalEntryWhereInput
  }

  export type CdrRequestListRelationFilter = {
    every?: CdrRequestWhereInput
    some?: CdrRequestWhereInput
    none?: CdrRequestWhereInput
  }

  export type InternationalRequestListRelationFilter = {
    every?: InternationalRequestWhereInput
    some?: InternationalRequestWhereInput
    none?: InternationalRequestWhereInput
  }

  export type ActivityReportListRelationFilter = {
    every?: ActivityReportWhereInput
    some?: ActivityReportWhereInput
    none?: ActivityReportWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JournalEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CdrRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InternationalRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActivityReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    approved?: SortOrder
    deactivated?: SortOrder
    cdrAccess?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    approved?: SortOrder
    deactivated?: SortOrder
    cdrAccess?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    approved?: SortOrder
    deactivated?: SortOrder
    cdrAccess?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type CaseActivityListRelationFilter = {
    every?: CaseActivityWhereInput
    some?: CaseActivityWhereInput
    none?: CaseActivityWhereInput
  }

  export type CaseActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CaseCountOrderByAggregateInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    title?: SortOrder
    category?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedAt?: SortOrder
    closureReason?: SortOrder
    officerId?: SortOrder
  }

  export type CaseMaxOrderByAggregateInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    title?: SortOrder
    category?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedAt?: SortOrder
    closureReason?: SortOrder
    officerId?: SortOrder
  }

  export type CaseMinOrderByAggregateInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    title?: SortOrder
    category?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedAt?: SortOrder
    closureReason?: SortOrder
    officerId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CaseRelationFilter = {
    is?: CaseWhereInput
    isNot?: CaseWhereInput
  }

  export type JournalEntryCountOrderByAggregateInput = {
    id?: SortOrder
    dayNumber?: SortOrder
    content?: SortOrder
    actions?: SortOrder
    createdAt?: SortOrder
    caseId?: SortOrder
    authorId?: SortOrder
  }

  export type JournalEntryAvgOrderByAggregateInput = {
    dayNumber?: SortOrder
  }

  export type JournalEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    dayNumber?: SortOrder
    content?: SortOrder
    actions?: SortOrder
    createdAt?: SortOrder
    caseId?: SortOrder
    authorId?: SortOrder
  }

  export type JournalEntryMinOrderByAggregateInput = {
    id?: SortOrder
    dayNumber?: SortOrder
    content?: SortOrder
    actions?: SortOrder
    createdAt?: SortOrder
    caseId?: SortOrder
    authorId?: SortOrder
  }

  export type JournalEntrySumOrderByAggregateInput = {
    dayNumber?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type CaseActivityCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseActivityMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseNullableRelationFilter = {
    is?: CaseWhereInput | null
    isNot?: CaseWhereInput | null
  }

  export type CdrRequestCountOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    telco?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    receivedAt?: SortOrder
    caseId?: SortOrder
    officerId?: SortOrder
    attachmentPath?: SortOrder
    attachmentName?: SortOrder
  }

  export type CdrRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    telco?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    receivedAt?: SortOrder
    caseId?: SortOrder
    officerId?: SortOrder
    attachmentPath?: SortOrder
    attachmentName?: SortOrder
  }

  export type CdrRequestMinOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    telco?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    receivedAt?: SortOrder
    caseId?: SortOrder
    officerId?: SortOrder
    attachmentPath?: SortOrder
    attachmentName?: SortOrder
  }

  export type InternationalRequestCountOrderByAggregateInput = {
    id?: SortOrder
    refNumber?: SortOrder
    direction?: SortOrder
    country?: SortOrder
    agency?: SortOrder
    subject?: SortOrder
    details?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    caseId?: SortOrder
    officerId?: SortOrder
    createdAt?: SortOrder
    respondedAt?: SortOrder
    attachmentPath?: SortOrder
    attachmentName?: SortOrder
  }

  export type InternationalRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    refNumber?: SortOrder
    direction?: SortOrder
    country?: SortOrder
    agency?: SortOrder
    subject?: SortOrder
    details?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    caseId?: SortOrder
    officerId?: SortOrder
    createdAt?: SortOrder
    respondedAt?: SortOrder
    attachmentPath?: SortOrder
    attachmentName?: SortOrder
  }

  export type InternationalRequestMinOrderByAggregateInput = {
    id?: SortOrder
    refNumber?: SortOrder
    direction?: SortOrder
    country?: SortOrder
    agency?: SortOrder
    subject?: SortOrder
    details?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    caseId?: SortOrder
    officerId?: SortOrder
    createdAt?: SortOrder
    respondedAt?: SortOrder
    attachmentPath?: SortOrder
    attachmentName?: SortOrder
  }

  export type ActivityReportCountOrderByAggregateInput = {
    id?: SortOrder
    weekStart?: SortOrder
    weekEnd?: SortOrder
    summary?: SortOrder
    casesWorked?: SortOrder
    challenges?: SortOrder
    nextSteps?: SortOrder
    status?: SortOrder
    officerId?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityReportMaxOrderByAggregateInput = {
    id?: SortOrder
    weekStart?: SortOrder
    weekEnd?: SortOrder
    summary?: SortOrder
    casesWorked?: SortOrder
    challenges?: SortOrder
    nextSteps?: SortOrder
    status?: SortOrder
    officerId?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityReportMinOrderByAggregateInput = {
    id?: SortOrder
    weekStart?: SortOrder
    weekEnd?: SortOrder
    summary?: SortOrder
    casesWorked?: SortOrder
    challenges?: SortOrder
    nextSteps?: SortOrder
    status?: SortOrder
    officerId?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseCreateNestedManyWithoutOfficerInput = {
    create?: XOR<CaseCreateWithoutOfficerInput, CaseUncheckedCreateWithoutOfficerInput> | CaseCreateWithoutOfficerInput[] | CaseUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOfficerInput | CaseCreateOrConnectWithoutOfficerInput[]
    createMany?: CaseCreateManyOfficerInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type JournalEntryCreateNestedManyWithoutAuthorInput = {
    create?: XOR<JournalEntryCreateWithoutAuthorInput, JournalEntryUncheckedCreateWithoutAuthorInput> | JournalEntryCreateWithoutAuthorInput[] | JournalEntryUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAuthorInput | JournalEntryCreateOrConnectWithoutAuthorInput[]
    createMany?: JournalEntryCreateManyAuthorInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type CdrRequestCreateNestedManyWithoutOfficerInput = {
    create?: XOR<CdrRequestCreateWithoutOfficerInput, CdrRequestUncheckedCreateWithoutOfficerInput> | CdrRequestCreateWithoutOfficerInput[] | CdrRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutOfficerInput | CdrRequestCreateOrConnectWithoutOfficerInput[]
    createMany?: CdrRequestCreateManyOfficerInputEnvelope
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
  }

  export type InternationalRequestCreateNestedManyWithoutOfficerInput = {
    create?: XOR<InternationalRequestCreateWithoutOfficerInput, InternationalRequestUncheckedCreateWithoutOfficerInput> | InternationalRequestCreateWithoutOfficerInput[] | InternationalRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutOfficerInput | InternationalRequestCreateOrConnectWithoutOfficerInput[]
    createMany?: InternationalRequestCreateManyOfficerInputEnvelope
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
  }

  export type ActivityReportCreateNestedManyWithoutOfficerInput = {
    create?: XOR<ActivityReportCreateWithoutOfficerInput, ActivityReportUncheckedCreateWithoutOfficerInput> | ActivityReportCreateWithoutOfficerInput[] | ActivityReportUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: ActivityReportCreateOrConnectWithoutOfficerInput | ActivityReportCreateOrConnectWithoutOfficerInput[]
    createMany?: ActivityReportCreateManyOfficerInputEnvelope
    connect?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
  }

  export type CaseUncheckedCreateNestedManyWithoutOfficerInput = {
    create?: XOR<CaseCreateWithoutOfficerInput, CaseUncheckedCreateWithoutOfficerInput> | CaseCreateWithoutOfficerInput[] | CaseUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOfficerInput | CaseCreateOrConnectWithoutOfficerInput[]
    createMany?: CaseCreateManyOfficerInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type JournalEntryUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<JournalEntryCreateWithoutAuthorInput, JournalEntryUncheckedCreateWithoutAuthorInput> | JournalEntryCreateWithoutAuthorInput[] | JournalEntryUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAuthorInput | JournalEntryCreateOrConnectWithoutAuthorInput[]
    createMany?: JournalEntryCreateManyAuthorInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type CdrRequestUncheckedCreateNestedManyWithoutOfficerInput = {
    create?: XOR<CdrRequestCreateWithoutOfficerInput, CdrRequestUncheckedCreateWithoutOfficerInput> | CdrRequestCreateWithoutOfficerInput[] | CdrRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutOfficerInput | CdrRequestCreateOrConnectWithoutOfficerInput[]
    createMany?: CdrRequestCreateManyOfficerInputEnvelope
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
  }

  export type InternationalRequestUncheckedCreateNestedManyWithoutOfficerInput = {
    create?: XOR<InternationalRequestCreateWithoutOfficerInput, InternationalRequestUncheckedCreateWithoutOfficerInput> | InternationalRequestCreateWithoutOfficerInput[] | InternationalRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutOfficerInput | InternationalRequestCreateOrConnectWithoutOfficerInput[]
    createMany?: InternationalRequestCreateManyOfficerInputEnvelope
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
  }

  export type ActivityReportUncheckedCreateNestedManyWithoutOfficerInput = {
    create?: XOR<ActivityReportCreateWithoutOfficerInput, ActivityReportUncheckedCreateWithoutOfficerInput> | ActivityReportCreateWithoutOfficerInput[] | ActivityReportUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: ActivityReportCreateOrConnectWithoutOfficerInput | ActivityReportCreateOrConnectWithoutOfficerInput[]
    createMany?: ActivityReportCreateManyOfficerInputEnvelope
    connect?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CaseUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<CaseCreateWithoutOfficerInput, CaseUncheckedCreateWithoutOfficerInput> | CaseCreateWithoutOfficerInput[] | CaseUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOfficerInput | CaseCreateOrConnectWithoutOfficerInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutOfficerInput | CaseUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: CaseCreateManyOfficerInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutOfficerInput | CaseUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutOfficerInput | CaseUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type JournalEntryUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<JournalEntryCreateWithoutAuthorInput, JournalEntryUncheckedCreateWithoutAuthorInput> | JournalEntryCreateWithoutAuthorInput[] | JournalEntryUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAuthorInput | JournalEntryCreateOrConnectWithoutAuthorInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutAuthorInput | JournalEntryUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: JournalEntryCreateManyAuthorInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutAuthorInput | JournalEntryUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutAuthorInput | JournalEntryUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type CdrRequestUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<CdrRequestCreateWithoutOfficerInput, CdrRequestUncheckedCreateWithoutOfficerInput> | CdrRequestCreateWithoutOfficerInput[] | CdrRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutOfficerInput | CdrRequestCreateOrConnectWithoutOfficerInput[]
    upsert?: CdrRequestUpsertWithWhereUniqueWithoutOfficerInput | CdrRequestUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: CdrRequestCreateManyOfficerInputEnvelope
    set?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    disconnect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    delete?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    update?: CdrRequestUpdateWithWhereUniqueWithoutOfficerInput | CdrRequestUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: CdrRequestUpdateManyWithWhereWithoutOfficerInput | CdrRequestUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: CdrRequestScalarWhereInput | CdrRequestScalarWhereInput[]
  }

  export type InternationalRequestUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<InternationalRequestCreateWithoutOfficerInput, InternationalRequestUncheckedCreateWithoutOfficerInput> | InternationalRequestCreateWithoutOfficerInput[] | InternationalRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutOfficerInput | InternationalRequestCreateOrConnectWithoutOfficerInput[]
    upsert?: InternationalRequestUpsertWithWhereUniqueWithoutOfficerInput | InternationalRequestUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: InternationalRequestCreateManyOfficerInputEnvelope
    set?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    disconnect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    delete?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    update?: InternationalRequestUpdateWithWhereUniqueWithoutOfficerInput | InternationalRequestUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: InternationalRequestUpdateManyWithWhereWithoutOfficerInput | InternationalRequestUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: InternationalRequestScalarWhereInput | InternationalRequestScalarWhereInput[]
  }

  export type ActivityReportUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<ActivityReportCreateWithoutOfficerInput, ActivityReportUncheckedCreateWithoutOfficerInput> | ActivityReportCreateWithoutOfficerInput[] | ActivityReportUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: ActivityReportCreateOrConnectWithoutOfficerInput | ActivityReportCreateOrConnectWithoutOfficerInput[]
    upsert?: ActivityReportUpsertWithWhereUniqueWithoutOfficerInput | ActivityReportUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: ActivityReportCreateManyOfficerInputEnvelope
    set?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    disconnect?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    delete?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    connect?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    update?: ActivityReportUpdateWithWhereUniqueWithoutOfficerInput | ActivityReportUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: ActivityReportUpdateManyWithWhereWithoutOfficerInput | ActivityReportUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: ActivityReportScalarWhereInput | ActivityReportScalarWhereInput[]
  }

  export type CaseUncheckedUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<CaseCreateWithoutOfficerInput, CaseUncheckedCreateWithoutOfficerInput> | CaseCreateWithoutOfficerInput[] | CaseUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOfficerInput | CaseCreateOrConnectWithoutOfficerInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutOfficerInput | CaseUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: CaseCreateManyOfficerInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutOfficerInput | CaseUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutOfficerInput | CaseUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type JournalEntryUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<JournalEntryCreateWithoutAuthorInput, JournalEntryUncheckedCreateWithoutAuthorInput> | JournalEntryCreateWithoutAuthorInput[] | JournalEntryUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAuthorInput | JournalEntryCreateOrConnectWithoutAuthorInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutAuthorInput | JournalEntryUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: JournalEntryCreateManyAuthorInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutAuthorInput | JournalEntryUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutAuthorInput | JournalEntryUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type CdrRequestUncheckedUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<CdrRequestCreateWithoutOfficerInput, CdrRequestUncheckedCreateWithoutOfficerInput> | CdrRequestCreateWithoutOfficerInput[] | CdrRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutOfficerInput | CdrRequestCreateOrConnectWithoutOfficerInput[]
    upsert?: CdrRequestUpsertWithWhereUniqueWithoutOfficerInput | CdrRequestUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: CdrRequestCreateManyOfficerInputEnvelope
    set?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    disconnect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    delete?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    update?: CdrRequestUpdateWithWhereUniqueWithoutOfficerInput | CdrRequestUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: CdrRequestUpdateManyWithWhereWithoutOfficerInput | CdrRequestUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: CdrRequestScalarWhereInput | CdrRequestScalarWhereInput[]
  }

  export type InternationalRequestUncheckedUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<InternationalRequestCreateWithoutOfficerInput, InternationalRequestUncheckedCreateWithoutOfficerInput> | InternationalRequestCreateWithoutOfficerInput[] | InternationalRequestUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutOfficerInput | InternationalRequestCreateOrConnectWithoutOfficerInput[]
    upsert?: InternationalRequestUpsertWithWhereUniqueWithoutOfficerInput | InternationalRequestUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: InternationalRequestCreateManyOfficerInputEnvelope
    set?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    disconnect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    delete?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    update?: InternationalRequestUpdateWithWhereUniqueWithoutOfficerInput | InternationalRequestUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: InternationalRequestUpdateManyWithWhereWithoutOfficerInput | InternationalRequestUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: InternationalRequestScalarWhereInput | InternationalRequestScalarWhereInput[]
  }

  export type ActivityReportUncheckedUpdateManyWithoutOfficerNestedInput = {
    create?: XOR<ActivityReportCreateWithoutOfficerInput, ActivityReportUncheckedCreateWithoutOfficerInput> | ActivityReportCreateWithoutOfficerInput[] | ActivityReportUncheckedCreateWithoutOfficerInput[]
    connectOrCreate?: ActivityReportCreateOrConnectWithoutOfficerInput | ActivityReportCreateOrConnectWithoutOfficerInput[]
    upsert?: ActivityReportUpsertWithWhereUniqueWithoutOfficerInput | ActivityReportUpsertWithWhereUniqueWithoutOfficerInput[]
    createMany?: ActivityReportCreateManyOfficerInputEnvelope
    set?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    disconnect?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    delete?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    connect?: ActivityReportWhereUniqueInput | ActivityReportWhereUniqueInput[]
    update?: ActivityReportUpdateWithWhereUniqueWithoutOfficerInput | ActivityReportUpdateWithWhereUniqueWithoutOfficerInput[]
    updateMany?: ActivityReportUpdateManyWithWhereWithoutOfficerInput | ActivityReportUpdateManyWithWhereWithoutOfficerInput[]
    deleteMany?: ActivityReportScalarWhereInput | ActivityReportScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCasesInput = {
    create?: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCasesInput
    connect?: UserWhereUniqueInput
  }

  export type JournalEntryCreateNestedManyWithoutCaseInput = {
    create?: XOR<JournalEntryCreateWithoutCaseInput, JournalEntryUncheckedCreateWithoutCaseInput> | JournalEntryCreateWithoutCaseInput[] | JournalEntryUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutCaseInput | JournalEntryCreateOrConnectWithoutCaseInput[]
    createMany?: JournalEntryCreateManyCaseInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type CdrRequestCreateNestedManyWithoutCaseInput = {
    create?: XOR<CdrRequestCreateWithoutCaseInput, CdrRequestUncheckedCreateWithoutCaseInput> | CdrRequestCreateWithoutCaseInput[] | CdrRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutCaseInput | CdrRequestCreateOrConnectWithoutCaseInput[]
    createMany?: CdrRequestCreateManyCaseInputEnvelope
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
  }

  export type InternationalRequestCreateNestedManyWithoutCaseInput = {
    create?: XOR<InternationalRequestCreateWithoutCaseInput, InternationalRequestUncheckedCreateWithoutCaseInput> | InternationalRequestCreateWithoutCaseInput[] | InternationalRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutCaseInput | InternationalRequestCreateOrConnectWithoutCaseInput[]
    createMany?: InternationalRequestCreateManyCaseInputEnvelope
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
  }

  export type CaseActivityCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type JournalEntryUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<JournalEntryCreateWithoutCaseInput, JournalEntryUncheckedCreateWithoutCaseInput> | JournalEntryCreateWithoutCaseInput[] | JournalEntryUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutCaseInput | JournalEntryCreateOrConnectWithoutCaseInput[]
    createMany?: JournalEntryCreateManyCaseInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type CdrRequestUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CdrRequestCreateWithoutCaseInput, CdrRequestUncheckedCreateWithoutCaseInput> | CdrRequestCreateWithoutCaseInput[] | CdrRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutCaseInput | CdrRequestCreateOrConnectWithoutCaseInput[]
    createMany?: CdrRequestCreateManyCaseInputEnvelope
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
  }

  export type InternationalRequestUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<InternationalRequestCreateWithoutCaseInput, InternationalRequestUncheckedCreateWithoutCaseInput> | InternationalRequestCreateWithoutCaseInput[] | InternationalRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutCaseInput | InternationalRequestCreateOrConnectWithoutCaseInput[]
    createMany?: InternationalRequestCreateManyCaseInputEnvelope
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
  }

  export type CaseActivityUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneWithoutCasesNestedInput = {
    create?: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCasesInput
    upsert?: UserUpsertWithoutCasesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCasesInput, UserUpdateWithoutCasesInput>, UserUncheckedUpdateWithoutCasesInput>
  }

  export type JournalEntryUpdateManyWithoutCaseNestedInput = {
    create?: XOR<JournalEntryCreateWithoutCaseInput, JournalEntryUncheckedCreateWithoutCaseInput> | JournalEntryCreateWithoutCaseInput[] | JournalEntryUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutCaseInput | JournalEntryCreateOrConnectWithoutCaseInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutCaseInput | JournalEntryUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: JournalEntryCreateManyCaseInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutCaseInput | JournalEntryUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutCaseInput | JournalEntryUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type CdrRequestUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CdrRequestCreateWithoutCaseInput, CdrRequestUncheckedCreateWithoutCaseInput> | CdrRequestCreateWithoutCaseInput[] | CdrRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutCaseInput | CdrRequestCreateOrConnectWithoutCaseInput[]
    upsert?: CdrRequestUpsertWithWhereUniqueWithoutCaseInput | CdrRequestUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CdrRequestCreateManyCaseInputEnvelope
    set?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    disconnect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    delete?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    update?: CdrRequestUpdateWithWhereUniqueWithoutCaseInput | CdrRequestUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CdrRequestUpdateManyWithWhereWithoutCaseInput | CdrRequestUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CdrRequestScalarWhereInput | CdrRequestScalarWhereInput[]
  }

  export type InternationalRequestUpdateManyWithoutCaseNestedInput = {
    create?: XOR<InternationalRequestCreateWithoutCaseInput, InternationalRequestUncheckedCreateWithoutCaseInput> | InternationalRequestCreateWithoutCaseInput[] | InternationalRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutCaseInput | InternationalRequestCreateOrConnectWithoutCaseInput[]
    upsert?: InternationalRequestUpsertWithWhereUniqueWithoutCaseInput | InternationalRequestUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: InternationalRequestCreateManyCaseInputEnvelope
    set?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    disconnect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    delete?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    update?: InternationalRequestUpdateWithWhereUniqueWithoutCaseInput | InternationalRequestUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: InternationalRequestUpdateManyWithWhereWithoutCaseInput | InternationalRequestUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: InternationalRequestScalarWhereInput | InternationalRequestScalarWhereInput[]
  }

  export type CaseActivityUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutCaseInput | CaseActivityUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutCaseInput | CaseActivityUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutCaseInput | CaseActivityUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type JournalEntryUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<JournalEntryCreateWithoutCaseInput, JournalEntryUncheckedCreateWithoutCaseInput> | JournalEntryCreateWithoutCaseInput[] | JournalEntryUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutCaseInput | JournalEntryCreateOrConnectWithoutCaseInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutCaseInput | JournalEntryUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: JournalEntryCreateManyCaseInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutCaseInput | JournalEntryUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutCaseInput | JournalEntryUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type CdrRequestUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CdrRequestCreateWithoutCaseInput, CdrRequestUncheckedCreateWithoutCaseInput> | CdrRequestCreateWithoutCaseInput[] | CdrRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CdrRequestCreateOrConnectWithoutCaseInput | CdrRequestCreateOrConnectWithoutCaseInput[]
    upsert?: CdrRequestUpsertWithWhereUniqueWithoutCaseInput | CdrRequestUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CdrRequestCreateManyCaseInputEnvelope
    set?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    disconnect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    delete?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    connect?: CdrRequestWhereUniqueInput | CdrRequestWhereUniqueInput[]
    update?: CdrRequestUpdateWithWhereUniqueWithoutCaseInput | CdrRequestUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CdrRequestUpdateManyWithWhereWithoutCaseInput | CdrRequestUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CdrRequestScalarWhereInput | CdrRequestScalarWhereInput[]
  }

  export type InternationalRequestUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<InternationalRequestCreateWithoutCaseInput, InternationalRequestUncheckedCreateWithoutCaseInput> | InternationalRequestCreateWithoutCaseInput[] | InternationalRequestUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: InternationalRequestCreateOrConnectWithoutCaseInput | InternationalRequestCreateOrConnectWithoutCaseInput[]
    upsert?: InternationalRequestUpsertWithWhereUniqueWithoutCaseInput | InternationalRequestUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: InternationalRequestCreateManyCaseInputEnvelope
    set?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    disconnect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    delete?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    connect?: InternationalRequestWhereUniqueInput | InternationalRequestWhereUniqueInput[]
    update?: InternationalRequestUpdateWithWhereUniqueWithoutCaseInput | InternationalRequestUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: InternationalRequestUpdateManyWithWhereWithoutCaseInput | InternationalRequestUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: InternationalRequestScalarWhereInput | InternationalRequestScalarWhereInput[]
  }

  export type CaseActivityUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutCaseInput | CaseActivityUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutCaseInput | CaseActivityUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutCaseInput | CaseActivityUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type CaseCreateNestedOneWithoutEntriesInput = {
    create?: XOR<CaseCreateWithoutEntriesInput, CaseUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: CaseCreateOrConnectWithoutEntriesInput
    connect?: CaseWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutEntriesInput = {
    create?: XOR<UserCreateWithoutEntriesInput, UserUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutEntriesInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CaseUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: XOR<CaseCreateWithoutEntriesInput, CaseUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: CaseCreateOrConnectWithoutEntriesInput
    upsert?: CaseUpsertWithoutEntriesInput
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutEntriesInput, CaseUpdateWithoutEntriesInput>, CaseUncheckedUpdateWithoutEntriesInput>
  }

  export type UserUpdateOneWithoutEntriesNestedInput = {
    create?: XOR<UserCreateWithoutEntriesInput, UserUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutEntriesInput
    upsert?: UserUpsertWithoutEntriesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEntriesInput, UserUpdateWithoutEntriesInput>, UserUncheckedUpdateWithoutEntriesInput>
  }

  export type CaseCreateNestedOneWithoutCaseActivitiesInput = {
    create?: XOR<CaseCreateWithoutCaseActivitiesInput, CaseUncheckedCreateWithoutCaseActivitiesInput>
    connectOrCreate?: CaseCreateOrConnectWithoutCaseActivitiesInput
    connect?: CaseWhereUniqueInput
  }

  export type CaseUpdateOneRequiredWithoutCaseActivitiesNestedInput = {
    create?: XOR<CaseCreateWithoutCaseActivitiesInput, CaseUncheckedCreateWithoutCaseActivitiesInput>
    connectOrCreate?: CaseCreateOrConnectWithoutCaseActivitiesInput
    upsert?: CaseUpsertWithoutCaseActivitiesInput
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutCaseActivitiesInput, CaseUpdateWithoutCaseActivitiesInput>, CaseUncheckedUpdateWithoutCaseActivitiesInput>
  }

  export type CaseCreateNestedOneWithoutCdrRequestsInput = {
    create?: XOR<CaseCreateWithoutCdrRequestsInput, CaseUncheckedCreateWithoutCdrRequestsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutCdrRequestsInput
    connect?: CaseWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCdrRequestsInput = {
    create?: XOR<UserCreateWithoutCdrRequestsInput, UserUncheckedCreateWithoutCdrRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCdrRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type CaseUpdateOneWithoutCdrRequestsNestedInput = {
    create?: XOR<CaseCreateWithoutCdrRequestsInput, CaseUncheckedCreateWithoutCdrRequestsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutCdrRequestsInput
    upsert?: CaseUpsertWithoutCdrRequestsInput
    disconnect?: CaseWhereInput | boolean
    delete?: CaseWhereInput | boolean
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutCdrRequestsInput, CaseUpdateWithoutCdrRequestsInput>, CaseUncheckedUpdateWithoutCdrRequestsInput>
  }

  export type UserUpdateOneWithoutCdrRequestsNestedInput = {
    create?: XOR<UserCreateWithoutCdrRequestsInput, UserUncheckedCreateWithoutCdrRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCdrRequestsInput
    upsert?: UserUpsertWithoutCdrRequestsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCdrRequestsInput, UserUpdateWithoutCdrRequestsInput>, UserUncheckedUpdateWithoutCdrRequestsInput>
  }

  export type CaseCreateNestedOneWithoutInternationalRequestsInput = {
    create?: XOR<CaseCreateWithoutInternationalRequestsInput, CaseUncheckedCreateWithoutInternationalRequestsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutInternationalRequestsInput
    connect?: CaseWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutInternationalRequestsInput = {
    create?: XOR<UserCreateWithoutInternationalRequestsInput, UserUncheckedCreateWithoutInternationalRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutInternationalRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type CaseUpdateOneWithoutInternationalRequestsNestedInput = {
    create?: XOR<CaseCreateWithoutInternationalRequestsInput, CaseUncheckedCreateWithoutInternationalRequestsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutInternationalRequestsInput
    upsert?: CaseUpsertWithoutInternationalRequestsInput
    disconnect?: CaseWhereInput | boolean
    delete?: CaseWhereInput | boolean
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutInternationalRequestsInput, CaseUpdateWithoutInternationalRequestsInput>, CaseUncheckedUpdateWithoutInternationalRequestsInput>
  }

  export type UserUpdateOneWithoutInternationalRequestsNestedInput = {
    create?: XOR<UserCreateWithoutInternationalRequestsInput, UserUncheckedCreateWithoutInternationalRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutInternationalRequestsInput
    upsert?: UserUpsertWithoutInternationalRequestsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInternationalRequestsInput, UserUpdateWithoutInternationalRequestsInput>, UserUncheckedUpdateWithoutInternationalRequestsInput>
  }

  export type UserCreateNestedOneWithoutActivityReportsInput = {
    create?: XOR<UserCreateWithoutActivityReportsInput, UserUncheckedCreateWithoutActivityReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityReportsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutActivityReportsNestedInput = {
    create?: XOR<UserCreateWithoutActivityReportsInput, UserUncheckedCreateWithoutActivityReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityReportsInput
    upsert?: UserUpsertWithoutActivityReportsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivityReportsInput, UserUpdateWithoutActivityReportsInput>, UserUncheckedUpdateWithoutActivityReportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CaseCreateWithoutOfficerInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    entries?: JournalEntryCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutOfficerInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    entries?: JournalEntryUncheckedCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutOfficerInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutOfficerInput, CaseUncheckedCreateWithoutOfficerInput>
  }

  export type CaseCreateManyOfficerInputEnvelope = {
    data: CaseCreateManyOfficerInput | CaseCreateManyOfficerInput[]
  }

  export type JournalEntryCreateWithoutAuthorInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    case: CaseCreateNestedOneWithoutEntriesInput
  }

  export type JournalEntryUncheckedCreateWithoutAuthorInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    caseId: string
  }

  export type JournalEntryCreateOrConnectWithoutAuthorInput = {
    where: JournalEntryWhereUniqueInput
    create: XOR<JournalEntryCreateWithoutAuthorInput, JournalEntryUncheckedCreateWithoutAuthorInput>
  }

  export type JournalEntryCreateManyAuthorInputEnvelope = {
    data: JournalEntryCreateManyAuthorInput | JournalEntryCreateManyAuthorInput[]
  }

  export type CdrRequestCreateWithoutOfficerInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
    case?: CaseCreateNestedOneWithoutCdrRequestsInput
  }

  export type CdrRequestUncheckedCreateWithoutOfficerInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    caseId?: string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type CdrRequestCreateOrConnectWithoutOfficerInput = {
    where: CdrRequestWhereUniqueInput
    create: XOR<CdrRequestCreateWithoutOfficerInput, CdrRequestUncheckedCreateWithoutOfficerInput>
  }

  export type CdrRequestCreateManyOfficerInputEnvelope = {
    data: CdrRequestCreateManyOfficerInput | CdrRequestCreateManyOfficerInput[]
  }

  export type InternationalRequestCreateWithoutOfficerInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
    case?: CaseCreateNestedOneWithoutInternationalRequestsInput
  }

  export type InternationalRequestUncheckedCreateWithoutOfficerInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    caseId?: string | null
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type InternationalRequestCreateOrConnectWithoutOfficerInput = {
    where: InternationalRequestWhereUniqueInput
    create: XOR<InternationalRequestCreateWithoutOfficerInput, InternationalRequestUncheckedCreateWithoutOfficerInput>
  }

  export type InternationalRequestCreateManyOfficerInputEnvelope = {
    data: InternationalRequestCreateManyOfficerInput | InternationalRequestCreateManyOfficerInput[]
  }

  export type ActivityReportCreateWithoutOfficerInput = {
    id?: string
    weekStart: Date | string
    weekEnd: Date | string
    summary: string
    casesWorked?: string | null
    challenges?: string | null
    nextSteps?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type ActivityReportUncheckedCreateWithoutOfficerInput = {
    id?: string
    weekStart: Date | string
    weekEnd: Date | string
    summary: string
    casesWorked?: string | null
    challenges?: string | null
    nextSteps?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type ActivityReportCreateOrConnectWithoutOfficerInput = {
    where: ActivityReportWhereUniqueInput
    create: XOR<ActivityReportCreateWithoutOfficerInput, ActivityReportUncheckedCreateWithoutOfficerInput>
  }

  export type ActivityReportCreateManyOfficerInputEnvelope = {
    data: ActivityReportCreateManyOfficerInput | ActivityReportCreateManyOfficerInput[]
  }

  export type CaseUpsertWithWhereUniqueWithoutOfficerInput = {
    where: CaseWhereUniqueInput
    update: XOR<CaseUpdateWithoutOfficerInput, CaseUncheckedUpdateWithoutOfficerInput>
    create: XOR<CaseCreateWithoutOfficerInput, CaseUncheckedCreateWithoutOfficerInput>
  }

  export type CaseUpdateWithWhereUniqueWithoutOfficerInput = {
    where: CaseWhereUniqueInput
    data: XOR<CaseUpdateWithoutOfficerInput, CaseUncheckedUpdateWithoutOfficerInput>
  }

  export type CaseUpdateManyWithWhereWithoutOfficerInput = {
    where: CaseScalarWhereInput
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyWithoutOfficerInput>
  }

  export type CaseScalarWhereInput = {
    AND?: CaseScalarWhereInput | CaseScalarWhereInput[]
    OR?: CaseScalarWhereInput[]
    NOT?: CaseScalarWhereInput | CaseScalarWhereInput[]
    id?: StringFilter<"Case"> | string
    caseNumber?: StringFilter<"Case"> | string
    title?: StringFilter<"Case"> | string
    category?: StringFilter<"Case"> | string
    status?: StringFilter<"Case"> | string
    description?: StringNullableFilter<"Case"> | string | null
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    closedAt?: DateTimeNullableFilter<"Case"> | Date | string | null
    closureReason?: StringNullableFilter<"Case"> | string | null
    officerId?: StringNullableFilter<"Case"> | string | null
  }

  export type JournalEntryUpsertWithWhereUniqueWithoutAuthorInput = {
    where: JournalEntryWhereUniqueInput
    update: XOR<JournalEntryUpdateWithoutAuthorInput, JournalEntryUncheckedUpdateWithoutAuthorInput>
    create: XOR<JournalEntryCreateWithoutAuthorInput, JournalEntryUncheckedCreateWithoutAuthorInput>
  }

  export type JournalEntryUpdateWithWhereUniqueWithoutAuthorInput = {
    where: JournalEntryWhereUniqueInput
    data: XOR<JournalEntryUpdateWithoutAuthorInput, JournalEntryUncheckedUpdateWithoutAuthorInput>
  }

  export type JournalEntryUpdateManyWithWhereWithoutAuthorInput = {
    where: JournalEntryScalarWhereInput
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyWithoutAuthorInput>
  }

  export type JournalEntryScalarWhereInput = {
    AND?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
    OR?: JournalEntryScalarWhereInput[]
    NOT?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
    id?: StringFilter<"JournalEntry"> | string
    dayNumber?: IntFilter<"JournalEntry"> | number
    content?: StringFilter<"JournalEntry"> | string
    actions?: StringNullableFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    caseId?: StringFilter<"JournalEntry"> | string
    authorId?: StringNullableFilter<"JournalEntry"> | string | null
  }

  export type CdrRequestUpsertWithWhereUniqueWithoutOfficerInput = {
    where: CdrRequestWhereUniqueInput
    update: XOR<CdrRequestUpdateWithoutOfficerInput, CdrRequestUncheckedUpdateWithoutOfficerInput>
    create: XOR<CdrRequestCreateWithoutOfficerInput, CdrRequestUncheckedCreateWithoutOfficerInput>
  }

  export type CdrRequestUpdateWithWhereUniqueWithoutOfficerInput = {
    where: CdrRequestWhereUniqueInput
    data: XOR<CdrRequestUpdateWithoutOfficerInput, CdrRequestUncheckedUpdateWithoutOfficerInput>
  }

  export type CdrRequestUpdateManyWithWhereWithoutOfficerInput = {
    where: CdrRequestScalarWhereInput
    data: XOR<CdrRequestUpdateManyMutationInput, CdrRequestUncheckedUpdateManyWithoutOfficerInput>
  }

  export type CdrRequestScalarWhereInput = {
    AND?: CdrRequestScalarWhereInput | CdrRequestScalarWhereInput[]
    OR?: CdrRequestScalarWhereInput[]
    NOT?: CdrRequestScalarWhereInput | CdrRequestScalarWhereInput[]
    id?: StringFilter<"CdrRequest"> | string
    phoneNumber?: StringFilter<"CdrRequest"> | string
    telco?: StringFilter<"CdrRequest"> | string
    periodStart?: DateTimeFilter<"CdrRequest"> | Date | string
    periodEnd?: DateTimeFilter<"CdrRequest"> | Date | string
    reason?: StringFilter<"CdrRequest"> | string
    status?: StringFilter<"CdrRequest"> | string
    requestedAt?: DateTimeFilter<"CdrRequest"> | Date | string
    receivedAt?: DateTimeNullableFilter<"CdrRequest"> | Date | string | null
    caseId?: StringNullableFilter<"CdrRequest"> | string | null
    officerId?: StringNullableFilter<"CdrRequest"> | string | null
    attachmentPath?: StringNullableFilter<"CdrRequest"> | string | null
    attachmentName?: StringNullableFilter<"CdrRequest"> | string | null
  }

  export type InternationalRequestUpsertWithWhereUniqueWithoutOfficerInput = {
    where: InternationalRequestWhereUniqueInput
    update: XOR<InternationalRequestUpdateWithoutOfficerInput, InternationalRequestUncheckedUpdateWithoutOfficerInput>
    create: XOR<InternationalRequestCreateWithoutOfficerInput, InternationalRequestUncheckedCreateWithoutOfficerInput>
  }

  export type InternationalRequestUpdateWithWhereUniqueWithoutOfficerInput = {
    where: InternationalRequestWhereUniqueInput
    data: XOR<InternationalRequestUpdateWithoutOfficerInput, InternationalRequestUncheckedUpdateWithoutOfficerInput>
  }

  export type InternationalRequestUpdateManyWithWhereWithoutOfficerInput = {
    where: InternationalRequestScalarWhereInput
    data: XOR<InternationalRequestUpdateManyMutationInput, InternationalRequestUncheckedUpdateManyWithoutOfficerInput>
  }

  export type InternationalRequestScalarWhereInput = {
    AND?: InternationalRequestScalarWhereInput | InternationalRequestScalarWhereInput[]
    OR?: InternationalRequestScalarWhereInput[]
    NOT?: InternationalRequestScalarWhereInput | InternationalRequestScalarWhereInput[]
    id?: StringFilter<"InternationalRequest"> | string
    refNumber?: StringFilter<"InternationalRequest"> | string
    direction?: StringFilter<"InternationalRequest"> | string
    country?: StringFilter<"InternationalRequest"> | string
    agency?: StringFilter<"InternationalRequest"> | string
    subject?: StringFilter<"InternationalRequest"> | string
    details?: StringNullableFilter<"InternationalRequest"> | string | null
    status?: StringFilter<"InternationalRequest"> | string
    priority?: StringFilter<"InternationalRequest"> | string
    caseId?: StringNullableFilter<"InternationalRequest"> | string | null
    officerId?: StringNullableFilter<"InternationalRequest"> | string | null
    createdAt?: DateTimeFilter<"InternationalRequest"> | Date | string
    respondedAt?: DateTimeNullableFilter<"InternationalRequest"> | Date | string | null
    attachmentPath?: StringNullableFilter<"InternationalRequest"> | string | null
    attachmentName?: StringNullableFilter<"InternationalRequest"> | string | null
  }

  export type ActivityReportUpsertWithWhereUniqueWithoutOfficerInput = {
    where: ActivityReportWhereUniqueInput
    update: XOR<ActivityReportUpdateWithoutOfficerInput, ActivityReportUncheckedUpdateWithoutOfficerInput>
    create: XOR<ActivityReportCreateWithoutOfficerInput, ActivityReportUncheckedCreateWithoutOfficerInput>
  }

  export type ActivityReportUpdateWithWhereUniqueWithoutOfficerInput = {
    where: ActivityReportWhereUniqueInput
    data: XOR<ActivityReportUpdateWithoutOfficerInput, ActivityReportUncheckedUpdateWithoutOfficerInput>
  }

  export type ActivityReportUpdateManyWithWhereWithoutOfficerInput = {
    where: ActivityReportScalarWhereInput
    data: XOR<ActivityReportUpdateManyMutationInput, ActivityReportUncheckedUpdateManyWithoutOfficerInput>
  }

  export type ActivityReportScalarWhereInput = {
    AND?: ActivityReportScalarWhereInput | ActivityReportScalarWhereInput[]
    OR?: ActivityReportScalarWhereInput[]
    NOT?: ActivityReportScalarWhereInput | ActivityReportScalarWhereInput[]
    id?: StringFilter<"ActivityReport"> | string
    weekStart?: DateTimeFilter<"ActivityReport"> | Date | string
    weekEnd?: DateTimeFilter<"ActivityReport"> | Date | string
    summary?: StringFilter<"ActivityReport"> | string
    casesWorked?: StringNullableFilter<"ActivityReport"> | string | null
    challenges?: StringNullableFilter<"ActivityReport"> | string | null
    nextSteps?: StringNullableFilter<"ActivityReport"> | string | null
    status?: StringFilter<"ActivityReport"> | string
    officerId?: StringNullableFilter<"ActivityReport"> | string | null
    createdAt?: DateTimeFilter<"ActivityReport"> | Date | string
  }

  export type UserCreateWithoutCasesInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: JournalEntryCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportCreateNestedManyWithoutOfficerInput
  }

  export type UserUncheckedCreateWithoutCasesInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportUncheckedCreateNestedManyWithoutOfficerInput
  }

  export type UserCreateOrConnectWithoutCasesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
  }

  export type JournalEntryCreateWithoutCaseInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    author?: UserCreateNestedOneWithoutEntriesInput
  }

  export type JournalEntryUncheckedCreateWithoutCaseInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    authorId?: string | null
  }

  export type JournalEntryCreateOrConnectWithoutCaseInput = {
    where: JournalEntryWhereUniqueInput
    create: XOR<JournalEntryCreateWithoutCaseInput, JournalEntryUncheckedCreateWithoutCaseInput>
  }

  export type JournalEntryCreateManyCaseInputEnvelope = {
    data: JournalEntryCreateManyCaseInput | JournalEntryCreateManyCaseInput[]
  }

  export type CdrRequestCreateWithoutCaseInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
    officer?: UserCreateNestedOneWithoutCdrRequestsInput
  }

  export type CdrRequestUncheckedCreateWithoutCaseInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    officerId?: string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type CdrRequestCreateOrConnectWithoutCaseInput = {
    where: CdrRequestWhereUniqueInput
    create: XOR<CdrRequestCreateWithoutCaseInput, CdrRequestUncheckedCreateWithoutCaseInput>
  }

  export type CdrRequestCreateManyCaseInputEnvelope = {
    data: CdrRequestCreateManyCaseInput | CdrRequestCreateManyCaseInput[]
  }

  export type InternationalRequestCreateWithoutCaseInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
    officer?: UserCreateNestedOneWithoutInternationalRequestsInput
  }

  export type InternationalRequestUncheckedCreateWithoutCaseInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    officerId?: string | null
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type InternationalRequestCreateOrConnectWithoutCaseInput = {
    where: InternationalRequestWhereUniqueInput
    create: XOR<InternationalRequestCreateWithoutCaseInput, InternationalRequestUncheckedCreateWithoutCaseInput>
  }

  export type InternationalRequestCreateManyCaseInputEnvelope = {
    data: InternationalRequestCreateManyCaseInput | InternationalRequestCreateManyCaseInput[]
  }

  export type CaseActivityCreateWithoutCaseInput = {
    id?: string
    userId?: string | null
    userName: string
    action: string
    detail?: string | null
    createdAt?: Date | string
  }

  export type CaseActivityUncheckedCreateWithoutCaseInput = {
    id?: string
    userId?: string | null
    userName: string
    action: string
    detail?: string | null
    createdAt?: Date | string
  }

  export type CaseActivityCreateOrConnectWithoutCaseInput = {
    where: CaseActivityWhereUniqueInput
    create: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput>
  }

  export type CaseActivityCreateManyCaseInputEnvelope = {
    data: CaseActivityCreateManyCaseInput | CaseActivityCreateManyCaseInput[]
  }

  export type UserUpsertWithoutCasesInput = {
    update: XOR<UserUpdateWithoutCasesInput, UserUncheckedUpdateWithoutCasesInput>
    create: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCasesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCasesInput, UserUncheckedUpdateWithoutCasesInput>
  }

  export type UserUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUpdateManyWithoutOfficerNestedInput
  }

  export type UserUncheckedUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUncheckedUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUncheckedUpdateManyWithoutOfficerNestedInput
  }

  export type JournalEntryUpsertWithWhereUniqueWithoutCaseInput = {
    where: JournalEntryWhereUniqueInput
    update: XOR<JournalEntryUpdateWithoutCaseInput, JournalEntryUncheckedUpdateWithoutCaseInput>
    create: XOR<JournalEntryCreateWithoutCaseInput, JournalEntryUncheckedCreateWithoutCaseInput>
  }

  export type JournalEntryUpdateWithWhereUniqueWithoutCaseInput = {
    where: JournalEntryWhereUniqueInput
    data: XOR<JournalEntryUpdateWithoutCaseInput, JournalEntryUncheckedUpdateWithoutCaseInput>
  }

  export type JournalEntryUpdateManyWithWhereWithoutCaseInput = {
    where: JournalEntryScalarWhereInput
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyWithoutCaseInput>
  }

  export type CdrRequestUpsertWithWhereUniqueWithoutCaseInput = {
    where: CdrRequestWhereUniqueInput
    update: XOR<CdrRequestUpdateWithoutCaseInput, CdrRequestUncheckedUpdateWithoutCaseInput>
    create: XOR<CdrRequestCreateWithoutCaseInput, CdrRequestUncheckedCreateWithoutCaseInput>
  }

  export type CdrRequestUpdateWithWhereUniqueWithoutCaseInput = {
    where: CdrRequestWhereUniqueInput
    data: XOR<CdrRequestUpdateWithoutCaseInput, CdrRequestUncheckedUpdateWithoutCaseInput>
  }

  export type CdrRequestUpdateManyWithWhereWithoutCaseInput = {
    where: CdrRequestScalarWhereInput
    data: XOR<CdrRequestUpdateManyMutationInput, CdrRequestUncheckedUpdateManyWithoutCaseInput>
  }

  export type InternationalRequestUpsertWithWhereUniqueWithoutCaseInput = {
    where: InternationalRequestWhereUniqueInput
    update: XOR<InternationalRequestUpdateWithoutCaseInput, InternationalRequestUncheckedUpdateWithoutCaseInput>
    create: XOR<InternationalRequestCreateWithoutCaseInput, InternationalRequestUncheckedCreateWithoutCaseInput>
  }

  export type InternationalRequestUpdateWithWhereUniqueWithoutCaseInput = {
    where: InternationalRequestWhereUniqueInput
    data: XOR<InternationalRequestUpdateWithoutCaseInput, InternationalRequestUncheckedUpdateWithoutCaseInput>
  }

  export type InternationalRequestUpdateManyWithWhereWithoutCaseInput = {
    where: InternationalRequestScalarWhereInput
    data: XOR<InternationalRequestUpdateManyMutationInput, InternationalRequestUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseActivityUpsertWithWhereUniqueWithoutCaseInput = {
    where: CaseActivityWhereUniqueInput
    update: XOR<CaseActivityUpdateWithoutCaseInput, CaseActivityUncheckedUpdateWithoutCaseInput>
    create: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput>
  }

  export type CaseActivityUpdateWithWhereUniqueWithoutCaseInput = {
    where: CaseActivityWhereUniqueInput
    data: XOR<CaseActivityUpdateWithoutCaseInput, CaseActivityUncheckedUpdateWithoutCaseInput>
  }

  export type CaseActivityUpdateManyWithWhereWithoutCaseInput = {
    where: CaseActivityScalarWhereInput
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseActivityScalarWhereInput = {
    AND?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
    OR?: CaseActivityScalarWhereInput[]
    NOT?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
    id?: StringFilter<"CaseActivity"> | string
    caseId?: StringFilter<"CaseActivity"> | string
    userId?: StringNullableFilter<"CaseActivity"> | string | null
    userName?: StringFilter<"CaseActivity"> | string
    action?: StringFilter<"CaseActivity"> | string
    detail?: StringNullableFilter<"CaseActivity"> | string | null
    createdAt?: DateTimeFilter<"CaseActivity"> | Date | string
  }

  export type CaseCreateWithoutEntriesInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officer?: UserCreateNestedOneWithoutCasesInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutEntriesInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officerId?: string | null
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutEntriesInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutEntriesInput, CaseUncheckedCreateWithoutEntriesInput>
  }

  export type UserCreateWithoutEntriesInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseCreateNestedManyWithoutOfficerInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportCreateNestedManyWithoutOfficerInput
  }

  export type UserUncheckedCreateWithoutEntriesInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutOfficerInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportUncheckedCreateNestedManyWithoutOfficerInput
  }

  export type UserCreateOrConnectWithoutEntriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEntriesInput, UserUncheckedCreateWithoutEntriesInput>
  }

  export type CaseUpsertWithoutEntriesInput = {
    update: XOR<CaseUpdateWithoutEntriesInput, CaseUncheckedUpdateWithoutEntriesInput>
    create: XOR<CaseCreateWithoutEntriesInput, CaseUncheckedCreateWithoutEntriesInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutEntriesInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutEntriesInput, CaseUncheckedUpdateWithoutEntriesInput>
  }

  export type CaseUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutCasesNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type UserUpsertWithoutEntriesInput = {
    update: XOR<UserUpdateWithoutEntriesInput, UserUncheckedUpdateWithoutEntriesInput>
    create: XOR<UserCreateWithoutEntriesInput, UserUncheckedCreateWithoutEntriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEntriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEntriesInput, UserUncheckedUpdateWithoutEntriesInput>
  }

  export type UserUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutOfficerNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUpdateManyWithoutOfficerNestedInput
  }

  export type UserUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutOfficerNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUncheckedUpdateManyWithoutOfficerNestedInput
  }

  export type CaseCreateWithoutCaseActivitiesInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officer?: UserCreateNestedOneWithoutCasesInput
    entries?: JournalEntryCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutCaseActivitiesInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officerId?: string | null
    entries?: JournalEntryUncheckedCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutCaseActivitiesInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutCaseActivitiesInput, CaseUncheckedCreateWithoutCaseActivitiesInput>
  }

  export type CaseUpsertWithoutCaseActivitiesInput = {
    update: XOR<CaseUpdateWithoutCaseActivitiesInput, CaseUncheckedUpdateWithoutCaseActivitiesInput>
    create: XOR<CaseCreateWithoutCaseActivitiesInput, CaseUncheckedCreateWithoutCaseActivitiesInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutCaseActivitiesInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutCaseActivitiesInput, CaseUncheckedUpdateWithoutCaseActivitiesInput>
  }

  export type CaseUpdateWithoutCaseActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutCasesNestedInput
    entries?: JournalEntryUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutCaseActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    entries?: JournalEntryUncheckedUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseCreateWithoutCdrRequestsInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officer?: UserCreateNestedOneWithoutCasesInput
    entries?: JournalEntryCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutCdrRequestsInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officerId?: string | null
    entries?: JournalEntryUncheckedCreateNestedManyWithoutCaseInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutCdrRequestsInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutCdrRequestsInput, CaseUncheckedCreateWithoutCdrRequestsInput>
  }

  export type UserCreateWithoutCdrRequestsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryCreateNestedManyWithoutAuthorInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportCreateNestedManyWithoutOfficerInput
  }

  export type UserUncheckedCreateWithoutCdrRequestsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAuthorInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportUncheckedCreateNestedManyWithoutOfficerInput
  }

  export type UserCreateOrConnectWithoutCdrRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCdrRequestsInput, UserUncheckedCreateWithoutCdrRequestsInput>
  }

  export type CaseUpsertWithoutCdrRequestsInput = {
    update: XOR<CaseUpdateWithoutCdrRequestsInput, CaseUncheckedUpdateWithoutCdrRequestsInput>
    create: XOR<CaseCreateWithoutCdrRequestsInput, CaseUncheckedCreateWithoutCdrRequestsInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutCdrRequestsInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutCdrRequestsInput, CaseUncheckedUpdateWithoutCdrRequestsInput>
  }

  export type CaseUpdateWithoutCdrRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutCasesNestedInput
    entries?: JournalEntryUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutCdrRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    entries?: JournalEntryUncheckedUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type UserUpsertWithoutCdrRequestsInput = {
    update: XOR<UserUpdateWithoutCdrRequestsInput, UserUncheckedUpdateWithoutCdrRequestsInput>
    create: XOR<UserCreateWithoutCdrRequestsInput, UserUncheckedCreateWithoutCdrRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCdrRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCdrRequestsInput, UserUncheckedUpdateWithoutCdrRequestsInput>
  }

  export type UserUpdateWithoutCdrRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUpdateManyWithoutAuthorNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUpdateManyWithoutOfficerNestedInput
  }

  export type UserUncheckedUpdateWithoutCdrRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUncheckedUpdateManyWithoutAuthorNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUncheckedUpdateManyWithoutOfficerNestedInput
  }

  export type CaseCreateWithoutInternationalRequestsInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officer?: UserCreateNestedOneWithoutCasesInput
    entries?: JournalEntryCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutInternationalRequestsInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
    officerId?: string | null
    entries?: JournalEntryUncheckedCreateNestedManyWithoutCaseInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutCaseInput
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutInternationalRequestsInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutInternationalRequestsInput, CaseUncheckedCreateWithoutInternationalRequestsInput>
  }

  export type UserCreateWithoutInternationalRequestsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportCreateNestedManyWithoutOfficerInput
  }

  export type UserUncheckedCreateWithoutInternationalRequestsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutOfficerInput
    activityReports?: ActivityReportUncheckedCreateNestedManyWithoutOfficerInput
  }

  export type UserCreateOrConnectWithoutInternationalRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInternationalRequestsInput, UserUncheckedCreateWithoutInternationalRequestsInput>
  }

  export type CaseUpsertWithoutInternationalRequestsInput = {
    update: XOR<CaseUpdateWithoutInternationalRequestsInput, CaseUncheckedUpdateWithoutInternationalRequestsInput>
    create: XOR<CaseCreateWithoutInternationalRequestsInput, CaseUncheckedCreateWithoutInternationalRequestsInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutInternationalRequestsInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutInternationalRequestsInput, CaseUncheckedUpdateWithoutInternationalRequestsInput>
  }

  export type CaseUpdateWithoutInternationalRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutCasesNestedInput
    entries?: JournalEntryUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutInternationalRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    entries?: JournalEntryUncheckedUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type UserUpsertWithoutInternationalRequestsInput = {
    update: XOR<UserUpdateWithoutInternationalRequestsInput, UserUncheckedUpdateWithoutInternationalRequestsInput>
    create: XOR<UserCreateWithoutInternationalRequestsInput, UserUncheckedCreateWithoutInternationalRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInternationalRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInternationalRequestsInput, UserUncheckedUpdateWithoutInternationalRequestsInput>
  }

  export type UserUpdateWithoutInternationalRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUpdateManyWithoutOfficerNestedInput
  }

  export type UserUncheckedUpdateWithoutInternationalRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUncheckedUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutOfficerNestedInput
    activityReports?: ActivityReportUncheckedUpdateManyWithoutOfficerNestedInput
  }

  export type UserCreateWithoutActivityReportsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestCreateNestedManyWithoutOfficerInput
  }

  export type UserUncheckedCreateWithoutActivityReportsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    approved?: boolean
    deactivated?: boolean
    cdrAccess?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutOfficerInput
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAuthorInput
    cdrRequests?: CdrRequestUncheckedCreateNestedManyWithoutOfficerInput
    internationalRequests?: InternationalRequestUncheckedCreateNestedManyWithoutOfficerInput
  }

  export type UserCreateOrConnectWithoutActivityReportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivityReportsInput, UserUncheckedCreateWithoutActivityReportsInput>
  }

  export type UserUpsertWithoutActivityReportsInput = {
    update: XOR<UserUpdateWithoutActivityReportsInput, UserUncheckedUpdateWithoutActivityReportsInput>
    create: XOR<UserCreateWithoutActivityReportsInput, UserUncheckedCreateWithoutActivityReportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivityReportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivityReportsInput, UserUncheckedUpdateWithoutActivityReportsInput>
  }

  export type UserUpdateWithoutActivityReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutOfficerNestedInput
  }

  export type UserUncheckedUpdateWithoutActivityReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    deactivated?: BoolFieldUpdateOperationsInput | boolean
    cdrAccess?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutOfficerNestedInput
    entries?: JournalEntryUncheckedUpdateManyWithoutAuthorNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutOfficerNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutOfficerNestedInput
  }

  export type CaseCreateManyOfficerInput = {
    id?: string
    caseNumber: string
    title: string
    category: string
    status?: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    closedAt?: Date | string | null
    closureReason?: string | null
  }

  export type JournalEntryCreateManyAuthorInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    caseId: string
  }

  export type CdrRequestCreateManyOfficerInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    caseId?: string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type InternationalRequestCreateManyOfficerInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    caseId?: string | null
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type ActivityReportCreateManyOfficerInput = {
    id?: string
    weekStart: Date | string
    weekEnd: Date | string
    summary: string
    casesWorked?: string | null
    challenges?: string | null
    nextSteps?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type CaseUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    entries?: JournalEntryUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
    entries?: JournalEntryUncheckedUpdateManyWithoutCaseNestedInput
    cdrRequests?: CdrRequestUncheckedUpdateManyWithoutCaseNestedInput
    internationalRequests?: InternationalRequestUncheckedUpdateManyWithoutCaseNestedInput
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateManyWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closureReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JournalEntryUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: StringFieldUpdateOperationsInput | string
  }

  export type JournalEntryUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: StringFieldUpdateOperationsInput | string
  }

  export type CdrRequestUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneWithoutCdrRequestsNestedInput
  }

  export type CdrRequestUncheckedUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CdrRequestUncheckedUpdateManyWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneWithoutInternationalRequestsNestedInput
  }

  export type InternationalRequestUncheckedUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestUncheckedUpdateManyWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActivityReportUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityReportUncheckedUpdateWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityReportUncheckedUpdateManyWithoutOfficerInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekStart?: DateTimeFieldUpdateOperationsInput | Date | string
    weekEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    casesWorked?: NullableStringFieldUpdateOperationsInput | string | null
    challenges?: NullableStringFieldUpdateOperationsInput | string | null
    nextSteps?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateManyCaseInput = {
    id?: string
    dayNumber: number
    content: string
    actions?: string | null
    createdAt?: Date | string
    authorId?: string | null
  }

  export type CdrRequestCreateManyCaseInput = {
    id?: string
    phoneNumber: string
    telco: string
    periodStart: Date | string
    periodEnd: Date | string
    reason: string
    status?: string
    requestedAt?: Date | string
    receivedAt?: Date | string | null
    officerId?: string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type InternationalRequestCreateManyCaseInput = {
    id?: string
    refNumber: string
    direction: string
    country: string
    agency: string
    subject: string
    details?: string | null
    status?: string
    priority?: string
    officerId?: string | null
    createdAt?: Date | string
    respondedAt?: Date | string | null
    attachmentPath?: string | null
    attachmentName?: string | null
  }

  export type CaseActivityCreateManyCaseInput = {
    id?: string
    userId?: string | null
    userName: string
    action: string
    detail?: string | null
    createdAt?: Date | string
  }

  export type JournalEntryUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneWithoutEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JournalEntryUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayNumber?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    actions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CdrRequestUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutCdrRequestsNestedInput
  }

  export type CdrRequestUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CdrRequestUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    telco?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    officer?: UserUpdateOneWithoutInternationalRequestsNestedInput
  }

  export type InternationalRequestUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InternationalRequestUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    refNumber?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    agency?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    officerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachmentPath?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseActivityUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseActivityUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CaseCountOutputTypeDefaultArgs instead
     */
    export type CaseCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CaseCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CaseDefaultArgs instead
     */
    export type CaseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CaseDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JournalEntryDefaultArgs instead
     */
    export type JournalEntryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JournalEntryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CaseActivityDefaultArgs instead
     */
    export type CaseActivityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CaseActivityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CdrRequestDefaultArgs instead
     */
    export type CdrRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CdrRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InternationalRequestDefaultArgs instead
     */
    export type InternationalRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InternationalRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActivityReportDefaultArgs instead
     */
    export type ActivityReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActivityReportDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}