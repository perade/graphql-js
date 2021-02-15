import { GraphQLError } from "../../error/GraphQLError.mjs";

/**
 * Unique input field names
 *
 * A GraphQL input object value is only valid if all supplied fields are
 * uniquely named.
 */
export function UniqueInputFieldNamesRule(context) {
  const knownNameStack = [];
  let knownNames = Object.create(null);
  return {
    ObjectValue: {
      enter() {
        knownNameStack.push(knownNames);
        knownNames = Object.create(null);
      },

      leave() {
        knownNames = knownNameStack.pop();
      }

    },

    ObjectField(node) {
      const fieldName = node.name.value;

      if (knownNames[fieldName]) {
        context.reportError(new GraphQLError(`There can be only one input field named "${fieldName}".`, [knownNames[fieldName], node.name]));
      } else {
        knownNames[fieldName] = node.name;
      }
    }

  };
}
