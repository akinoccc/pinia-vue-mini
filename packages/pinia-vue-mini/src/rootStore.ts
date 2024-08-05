import { EffectScope, inject, InjectionKey, Ref } from '@vue-mini/core'
import { StoreGeneric } from './types'

export const piniaSymbol = Symbol() as InjectionKey<Pinia>

export interface Pinia {
  /**
     * root state
     */
  state: Ref<Record<string, any>>
  
  // /**
  //  * Installed store plugins
  //  *
  //  * @internal
  //  */
  // _p: PiniaPlugin[]
  
  /**
     * Effect scope the pinia is attached to
     *
     * @internal
     */
  _e: EffectScope
  
  /**
     * Registry of stores used by this pinia.
     *
     * @internal
     */
  _s: Map<string, StoreGeneric>
}

export let activePinia: Pinia | undefined

export function setActivePinia(pinia?: Pinia) {
  activePinia = pinia
  console.log('🍍 Pinia actived.')
}

export function getActivePinia(): Pinia | undefined {
  return inject(piniaSymbol) || activePinia
}
