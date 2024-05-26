import { IResource } from './interfaces';
import { Roles } from './roles';

export class ResourceConstant {
  //*****************************************************************//
  //************************* SEEDER ***************************//
  //*****************************************************************//

  /**
   * @description Resource that captures the request to create metrics
   * @constant
   * @type {Object} SEED
   * @default
   */
  public static readonly SEED: IResource = {
    action: 'SEED',
    resource: 'SEEDER',
    verb: 'POST',
    endpoint: '/seeder',
    signWith: '',
    type: 'WRITE',
    name: 'Create core accounts',
    description: 'Create core accounts',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: '',
      },
    },
  };

  /**
   * @description Resource that captures the request to create metrics
   * @constant
   * @type {Object} UPDATE_PERMISSIONS
   * @default
   */
  public static readonly UPDATE_PERMISSIONS: IResource = {
    action: 'UPDATE_PERMISSIONS',
    resource: 'SEEDER',
    verb: 'PUT',
    endpoint: '/seeder/permissions',
    signWith: '',
    type: 'WRITE',
    name: 'Update existing user permissions',
    description: 'Update existing user permissions',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: '',
      },
    },
  };

  //*****************************************************************//
  //************************* USERS ***************************//
  //*****************************************************************//

  /**
   * @description Resource that captures the request to get (*) users
   * @constant
   * @type {Object} GET_USERS
   * @default
   */
  public static readonly GET_USERS: IResource = {
    action: 'GET_USERS',
    resource: 'USERS',
    verb: 'GET',
    endpoint: '/users',
    signWith: 'TOKEN',
    type: 'READ',
    name: 'List All Users',
    description: 'Allows retrieving the list of all users',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: 'organizationId',
      },
    },
  };

  /**
   * @description Resource that captures the request to add a new user by
   * creating a new entry in db
   * @constant
   * @type {Object} REGISTER_USERS
   * @default
   */
  public static readonly REGISTER_USERS: IResource = {
    action: 'REGISTER_USERS',
    resource: 'USERS',
    verb: 'POST',
    endpoint: '/users',
    signWith: 'TOKEN',
    type: 'WRITE',
    name: 'Register a new User',
    description: 'Allows to add a new user',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: 'organizationId',
      },
    },
  };

  /**
   * @description Resource that captures the request to login an existing user by
   * validating an existing entry in db
   * @constant
   * @type {Object} LOGIN_USER
   * @default
   */
  public static readonly LOGIN_USERS: IResource = {
    action: 'LOGIN_USER',
    resource: 'USERS',
    verb: 'POST',
    endpoint: '/users/session/email',
    signWith: '',
    type: 'WRITE',
    name: 'Login an existing User',
    description: 'Allows to login an existing user',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: '',
      },
    },
  };

  /**
   * @description Resource that captures the request to login an existing user by
   * validating an existing entry in db
   * @constant
   * @type {Object} LOGOUT_USER
   * @default
   */
  public static readonly LOGOUT_USERS: IResource = {
    action: 'LOGOUT_USER',
    resource: 'USERS',
    verb: 'DELETE',
    endpoint: '/users/session',
    signWith: 'TOKEN',
    type: 'WRITE',
    name: 'Logout an existing User',
    description: 'Allows to logout an existing user',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: 'userId',
      },
    },
  };

  /**
   * @description Resource that captures the request to delete a user
   * @constant
   * @type {Object} DELETE_USER
   * @default
   */
  public static readonly DELETE_USERS: IResource = {
    action: 'DELETE_USERS',
    resource: 'USERS',
    verb: 'DELETE',
    endpoint: '/users',
    signWith: 'TOKEN',
    type: 'WRITE',
    name: 'Delete an existing User',
    description: 'Allows to delete an existing user',
    roles: {
      ADMIN: {
        role: Roles.ADMIN.role,
        restriction: '',
      },
      CUSTOMER: {
        role: Roles.CUSTOMER.role,
        restriction: 'organizationId',
      },
    },
  };

  private constructor() {}
}
