"use strict";(self.webpackChunkconnect=self.webpackChunkconnect||[]).push([[344],{344:(e,a,l)=>{l.r(a),l.d(a,{default:()=>m});var t=l(8318);class n extends t.oi{render(){return t.dy`
            <div class="md-layout-column">
                        <!-- pane -->
                        <div id="pane" class="md-layout-column__item md-layout-column__item--expanded4 md-layout-column__item--medium4 md-layout-column__item--compact4">
                            <md-pane
                                icons='[{"icon":"image"}]'
                                label="Label"
                                actions='[{"icon":"image"},{"icon":"image"}]'
                                buttons='[{"label":"Label","filled":true},{"label":"Label","outlined":true}]'
                            >pane</md-pane>
                        </div>
                        <div class="md-layout-column__item md-layout-column__item--expanded4 md-layout-column__item--medium4 md-layout-column__item--compact4">
                            <md-pane
                                id="paneDialog"
                                class="md-pane--dialog"
                                icons='[{"icon":"image"}]'
                                label="Label"
                                actions='[{"icon":"image"},{"icon":"image"}]'
                                buttons='[{"label":"Label","filled":true},{"label":"Label","outlined":true}]'
                            >pane</md-pane>
                            <md-button label="Dialog" tonal onclick="paneDialog.toggle()"></md-button>
                        </div>
                        <div class="md-layout-column__item md-layout-column__item--expanded4 md-layout-column__item--medium4 md-layout-column__item--compact4">
                            <md-pane
                                id="paneSheet"
                                class="md-pane--sheet md-pane--sheet-bottom"
                                icons='[{"icon":"image"}]'
                                label="Label"
                                actions='[{"icon":"image"},{"icon":"image"}]'
                                buttons='[{"label":"Label","filled":true},{"label":"Label","outlined":true}]'
                            >pane</md-pane>
                            <md-button label="Sheet" tonal onclick="paneSheet.toggle()"></md-button>
                        </div>
            </div>
        `}createRenderRoot(){return this}}customElements.define("dev-pane",n);const m=document.createElement("dev-pane")}}]);