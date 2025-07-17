interface Entity {
  data: Record<string, any>;
  parents?: Entity[];
  calculated?: any;
  actor?: Entity;
  [key: string]: any;
}

interface Catalog {
  Data?: any[];
  Struct?: any[];
  const?: any[];
  path?: string;
}

interface StringCatalog {
  [key: string]: { [locale: string]: string };
}

declare class SC2Mod {
  constructor(options?: Partial<SC2Mod>);

  // Public properties
  cache: Record<string, Record<string, Entity>>;
  catalogs: Catalog[];
  dependencies?: SC2Mod[];
  strings: Record<string, StringCatalog>;

  // Public methods
  calculateStrings(locale: string): void;

  resolveUnitsActors(): void;

  resolveUnitUpgrades(): { affectingUpgrades: any[] };

  resolveButtons(): void;

  getRequirements(detailed?: boolean): {
    abilcmds: string[];
    units: string[];
    upgrades: string[];
    producers: string[];
  };

  setEntitiesRelations(): void;

  mergeCatalogs(): void;

  addDocInfo(mod: SC2Mod, text: any, locale: string): void;

  calculateAllValues(entity: Entity): any;

  merge(mod: SC2Mod): void;

  // Static factory method
  static fromJSON(data: any): SC2Mod;
}

export default SC2Mod;
