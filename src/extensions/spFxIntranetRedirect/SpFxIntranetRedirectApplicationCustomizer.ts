import { override } from "@microsoft/decorators";
import { BaseApplicationCustomizer } from "@microsoft/sp-application-base";

import * as strings from "ext-redirect-str";

const LOG_SOURCE: string = "SpFxIntranetRedirectApplicationCustomizer";

declare const __SCRIPT_URL__: string;

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpFxIntranetRedirectApplicationCustomizerProperties {}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpFxIntranetRedirectApplicationCustomizer extends BaseApplicationCustomizer<ISpFxIntranetRedirectApplicationCustomizerProperties> {
  @override
  public onInit(): Promise<void> {
    console.log(LOG_SOURCE, `Initialized ${strings.Title}`);
    this._loadScriptLink();
    return Promise.resolve();
  }

  private _onDispose(): void {
    // handle cleanup if needed
  }

  private _loadScriptLink(): void {
    let head = document.getElementsByTagName("head");
    let scriptId = "bah-redirect-script-link";
    if (head && head.length > 0 && !document.getElementById(scriptId)) {
      let scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.src = __SCRIPT_URL__;
      head[0].appendChild(scriptTag);
    }
  }
}
