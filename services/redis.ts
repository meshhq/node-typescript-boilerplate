// External Dependencies
import { Promise as Bluebird } from 'sequelize'
import * as redis from 'redis'
import { Callback as RedCB } from 'redis'
import * as Redlock from 'redlock'
import { Promise } from 'sequelize'

// Types
export type transactionParam = (client: redis.Multi) => void
export type Multi = redis.Multi
export type Lock = Redlock.Lock
type RedisClient = redis.RedisClient | redis.Multi

export default class Redis {

	/**
	 * Locking Methods
	 * TBD if we move this into another class
	 */
	public static RedLock(retryCount = 500, retryDelay = 50, retryVariance = 200): Redlock {
		const opts = {
			driftFactor: 0.01,
			retryCount: retryCount,
			retryDelay: retryDelay,
			retryJitter: retryVariance
		}
		return new Redlock([this.SharedInstance()], opts)
	}

	/**
 	* Redis Client Instance
 	*/
	public static RedisClient(): redis.RedisClient {
		return this.SharedInstance()
	}

	/**
	 * Redis Specific Operation
	 */

	/**
	 * Set key to hold a string value. If key already holds a value it is overwritten and,
	 * any previous time to live associated with the key is discarded.
	 *
	 * @param keyName Name of the key.
	 * @param value String value to be stored at key.
	 */
	public static setValueForKey(keyName: string, value: string): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().set(keyName, value, (err: Error, res: string) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 'OK')
			})
		})
	}

	/**
 	* Sets a key for a value only if the key doesn't exist. The promise's boolean
 	* will be true if the set succeded, and false if it failed
 	* @param keyName Name of the key.
 	* @param value String value to be stored at key.
 	*/
	public static setValueForKeyIfNoneExists(keyName: string, value: string): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().setnx(keyName, value, (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 1)
			})
		})
	}

	/**
	 * Removes the value for a given key in Redis
	 * @param key The key for te value to be removed
	 */
	public static removeValueForKey(key: string): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().del(key, (err: Error) => {
				if (err) {
					return reject(false)
				}
				resolve(true)
			})
		})
	}

	/**
	 * Queries redis for keys matching the given input pattern.
	 * NOTE: This is primarily used for testing
	 * @param keyName Name of the key.
	 * @param value String value to be stored at key.
	 */
	public static keys(keyNamePattern: string): Bluebird<string[]> {
		return new Bluebird<string[]>((resolve: (success: string[]) => void, reject: (err: Error) => void) => {
			Redis.SharedInstance().keys(keyNamePattern, (err: Error, res: string[]) => {
				if (err) {
					return reject(err)
				}
				resolve(res)
			})
		})
	}

	/**
	 * Set key to hold a string value and set key to timeout after a given number of seconds.
	 *
	 * @param keyName The name of key.
	 * @param value Value to be stored at key.
	 * @param expiration Time in seconds for the key to expire.
	 */
	public static setValueForKeyWithExpiration(keyName: string, value: string, expiration: number): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err: Error) => void) => {
			Redis.SharedInstance().setex(keyName, expiration, value, (err: Error, res: string) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 'OK')
			})
		})
	}

	/**
	 * Fetches the value at a given key.
	 * @param keyName Name of the key storing the value.
	 */
	public static valueForKey(keyName: string): Bluebird<string> {
		return new Bluebird<string>((resolve: (success: string) => void, reject: (err: Error) => void) => {
			Redis.SharedInstance().get(keyName, (err: Error, res: string) => {
				if (err) {
					return reject(err)
				}
				resolve(res)
			})
		})
	}

	/**
	 * Sets field in the hash set stored at key to value. If key does not exist,
	 * a new key holding a hash is created. If field exists in hash, it is overwritten.
	 * If the hash set doesn't exist, one will be created and key/values will be set.
	 *
	 * @param hashSetName The name of the hash set.
	 * @param key The name of the key to store in hash.
	 * @param value The value to be stored at the key.
	 */
	public static pushToHashSet(hashSetName: string, key: string, value: string): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err: Error) => void) => {
			Redis.SharedInstance().hset(hashSetName, key, value, (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 1)
			})
		})
	}

	/**
	 * Return all fields and values of the hash stored at key.
	 * In the returned value, every field name is followed by it's value,
	 * so the length of the reply is twice the size of the hash.
	 *
	 * @param hashSetName Name of the hash set.
	 */
	public static valuesForHashSet(hashSetName: string): Bluebird<any> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().hgetall(hashSetName, (err: Error, res: any) => {
				if (err) {
					return reject(err)
				}
				resolve(res)
			})
		})
	}

	/**
	 * Returns the length of the list associated with the given key,
	 * returns 0 if either the list is empty of if the list doesn't exist
	 *
	 * @param key Key of the list
	 * @param (optional) Mutli client for transactions
	 */
	public static lengthOfListWithKey(listKey: string): Bluebird<number> {
		const client: RedisClient = Redis.SharedInstance()
		return new Bluebird<number>((resolve: (success: number) => void, reject: (err?: any) => void) => {
			client.llen(listKey, (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res)
			})
		})
	}

	/**
	 * Determines if a key exists.
	 *
	 * @param keyName Name of the key.
	 * @param (optional) Mutli client for transactions
	 */
	public static keyExists(keyName: string): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().exists(keyName, (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 1)
			})
		})
	}

	/**
	 * Inserts all the specified values at the tail of the list stored at key.
	 * If key does not exist, it is created as an empty list before performing the push operation.
	 *
	 * @param listName The name of the list to push to.
	 * @param value The value/values to insert into the list.
	 */
	public static pushToOrCreateList(listName: string, value: string): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().rpush(listName, value, (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 1)
			})
		})
	}

	/**
	 * Inserts all the specified values at the tail of the list stored at key.
	 * Note that if list doesn't exist at key, a 0 will be returned in response,
	 * indicating that no values have been pushed. Use pushToOrCreateList instead.
	 *
	 * @param listName Name of the list.
	 * @param value Value to push to the end of the list.
	 */
	public static pushToExistingList(listName: string, value: string): Bluebird<number> {
		return new Bluebird<number>((resolve: (success: number) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().rpushx(listName, value, (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res)
			})
		})
	}

	/**
	 * Returns the specified elements of the list stored at key.
	 * The offsets start and stop are zero-based indexes,
	 * with 0 being the element at the head of the list.
	 * Offsets can also be negative, -1 being the last element in the list.
	 *
	 * @param keyName The name of the key storing the list.
	 * @param offsetOne The first offest specifing where to start returning elements.
	 * @param offsetTwo The second offset specifing where to stop retuning elements.
	 */
	public static arrayValues(keyName: string, offsetOne: number, offsetTwo: number): Bluebird<any> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			Redis.SharedInstance().lrange(keyName, offsetOne, offsetTwo, (err: Error, res: any) => {
				if (err) {
					return reject(err)
				}
				resolve(res)
			})
		})
	}

	/**
	 * Sets an expiration time in milliseconds on a key.
	 * @param keyName Name of the key that will expire.
	 * @param milliseconds Expiration time for key in milliseconds.
	 */
	public static setKeyTimeout(keyName: string, milliseconds: number): Bluebird<boolean> {
		const timeStamp = String(milliseconds)
		const cmd = `PEXPIRE`
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			const client = Redis.SharedInstance() as redis.RedisClient
			client.send_command(cmd, [keyName, timeStamp], (err: Error, res: number) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 1)
			})
		})
	}

	/**
	 * Destroys redis.
	 * NOTE: Should never be called during non-test env
	 */
	public static flushRedis(): Bluebird<boolean> {
		return new Bluebird<boolean>((resolve: (success: boolean) => void, reject: (err?: any) => void) => {
			const client = Redis.SharedInstance() as redis.RedisClient
			client.flushall((err: Error, res: string) => {
				if (err) {
					return reject(err)
				}
				resolve(res === 'OK')
			})
		})
	}

	/**
	 * Marks the start of a transaction block. Subsequent commands will be queued for atomic execution.
	 *
	 * @param transactionCommands A function containing all of the commands to be run inside transaction block.
	 * @param done Callback to be run after all commands have finished executing.
	 */
	public static transaction(transactionCommands: transactionParam, done: RedCB<any[]>) {
		const multiClient = Redis.SharedInstance().multi()
		transactionCommands(multiClient)
		multiClient.exec(done)
	}

	private static _instance: redis.RedisClient
	private static SharedInstance(): redis.RedisClient {
		// Check to see if we've init'd our client
		if (!Redis._instance) {
			const clientOpts = Redis.clientOptions()
			Redis._instance = redis.createClient(clientOpts)
		}
		return Redis._instance
	}

	private static clientOptions(): redis.ClientOpts {
		return {
			host: "localhost",
			port: 6379
		}
	}
}
