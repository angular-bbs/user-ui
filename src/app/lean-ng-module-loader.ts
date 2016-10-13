import { Injectable, NgModuleFactory, NgModuleFactoryLoader, Compiler, Type } from '@angular/core';

class LoaderCallback {
  constructor(public callback) {
  }
}

export let load: any = (callback: Function) => {
  return new LoaderCallback(callback);
};

/**
 * A lean & pure module factory loader for simply load another module which needn't any async feature
 * NgModuleFactoryLoader that uses Promise to load NgModule type and then compiles them.
 * @experimental
 */
@Injectable()
export class LeanNgModuleLoader implements NgModuleFactoryLoader {
  constructor(private compiler: Compiler) {
  }


  load(data): Promise<NgModuleFactory<any>> {
    return Promise.resolve(data)
      .then((type: any) => checkNotEmpty(type, '', ''))
      .then((type: any) => this.compiler.compileModuleAsync(type));
  }
}

function checkNotEmpty(value: any, modulePath: string, exportName: string): any {
  if (!value) {
    throw new Error(`Cannot find '${exportName}' in '${modulePath}'`);
  }
  return value;
}
