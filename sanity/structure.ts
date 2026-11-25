import { StructureBuilder } from "sanity/structure"
export const structure = (S: StructureBuilder) => S.list().title("Zeva Collection").items([
  S.listItem().title("Products").child(S.documentTypeList("product").title("Products")),
  S.listItem().title("Categories").child(S.documentTypeList("category").title("Categories")),
  S.divider(), S.listItem().title("Orders").child(S.documentTypeList("order").title("Orders")),
])
