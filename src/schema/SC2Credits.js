// File Example
// <CreditEntryList>
//     <CreditEntry type="Background" texture="Assets/Textures/loading-agria.dds"/>
//     <CreditEntry templatename="CreditsEntryBlankTemplate" offset="100"/>
//     <CreditEntry type="FadingFrame" text="@UI/CreditText/OPENING" templatename="CreditsEntryLargeHeadingTemplate" fadetime="3000"/>
// </CreditEntryList>


export const SCreditEntry = {}
export const SCreditEntryList = {CreditEntry: [SCreditEntry]}

export default {
    CreditEntry: SCreditEntry,
    CreditEntryList: SCreditEntryList
}