export class CommonController {
  protected services: { [key: string]: any } = {};
  
  callServiceByVariable(variable: string): any {
    if (this.services[variable]) {
      return this.services[variable].service;
    } else {
      throw new Error(`Service for '${variable}' is not available.`);
    }
  }
}
