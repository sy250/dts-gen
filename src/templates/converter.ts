// eslint-disable-next-line no-unused-vars
import { FieldTypeGroups } from "../converters/fileldtype-converter";
import * as F from "./expressions/fields";
import { Namespace } from "./expressions/namespace";
import {
    TypeDefinition,
    SavedTypeDefinition,
} from "./expressions/typedefinitions";
// eslint-disable-next-line no-unused-vars
import { FieldType } from "../kintone/clients/forms-client";

export function convertToTsExpression({
    namespace,
    typeName,
    fieldTypeGroups,
}: {
    namespace: string;
    typeName: string;
    fieldTypeGroups: FieldTypeGroups;
}): Namespace {
    const fieldGroup = convertToFieldGroup(fieldTypeGroups);
    const subTableFields = fieldTypeGroups.subTableFields.map(
        f =>
            new F.SubTableField(
                f.code,
                f.type,
                convertToFieldGroup(f.fields)
            )
    );

    const typeDefenition = new TypeDefinition(
        typeName,
        fieldGroup,
        subTableFields
    );

    const userFields = fieldTypeGroups.userFieldsInSavedRecord.map(
        f => new F.UserField(f.code, f.type)
    );

    const stringFieldsInSavedRecord = fieldTypeGroups.stringFieldsInSavedRecord.map(
        f => new F.StringField(f.code, f.type)
    );

    const savedTypeDefenition = new SavedTypeDefinition(
        typeName,
        userFields,
        stringFieldsInSavedRecord
    );

    return new Namespace(
        namespace,
        typeDefenition,
        savedTypeDefenition
    );
}

interface ConvertToFieldGroupInput {
    stringFields: FieldType[];
    stringListFields: FieldType[];
    entityListFields: FieldType[];
    fileTypeFields: FieldType[];
}
function convertToFieldGroup(
    input: ConvertToFieldGroupInput
): F.FieldGroup {
    const stringFields = input.stringFields.map(
        f => new F.StringField(f.code, f.type)
    );

    const stringListFields = input.stringListFields.map(
        f => new F.StringListField(f.code, f.type)
    );

    const entityFields = input.entityListFields.map(
        f => new F.EntityListField(f.code, f.type)
    );

    const fileFields = input.fileTypeFields.map(
        f => new F.FileField(f.code, f.type)
    );

    return new F.FieldGroup(
        stringFields,
        stringListFields,
        entityFields,
        fileFields
    );
}
