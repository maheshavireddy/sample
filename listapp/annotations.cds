
using CatalogService as service from '../../srv/interaction_srv';
annotate service.vJunction with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
        },
        {
            $Type : 'UI.DataField',
            Value : PRODUCT_ID,
        },
        {
            $Type : 'UI.DataField',
            Value : UNIQUE_DES,
        },
        {
            $Type : 'UI.DataField',
            Value : UID_TYPE,
        },
        {
            $Type : 'UI.DataField',
            Value : ACTIVE,
        },
         {
            $Type : 'UI.DataField',
            Value : CHAR_NUM,
        },
        {
            $Type : 'UI.DataField',
            Value : CHAR_NUM_VAL ,
        },
        
        
    ]
);
annotate service.vJunction with @(
    UI.FieldGroup #GeneratedGroup1 : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Value : PRODUCT_ID,
            },
            {
                $Type : 'UI.DataField',
                Value : UNIQUE_DES,
            },
            {
                $Type : 'UI.DataField',
                Value : UID_TYPE,
            },
            {
                $Type : 'UI.DataField',
                Value : ACTIVE,
            },
            {
                $Type : 'UI.DataField',
                Value : PRODUCT,
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NUM,
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NUM_VAL,
            },
        ],
    },
    UI.Facets : [{
       $Type : 'UI.CollectionFacet',
         ID : 'GeneratedFacet1',
         Label:'General Information',
        Facets:[{
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        }]
        }]
);
annotate service.vJunction with @(UI.SelectionFields: [
PRODUCT_ID,
UID_TYPE
],
Capabilities.SearchRestrictions: {
    Searchable: true
  });
// annotate  service. vJunction with {
//   PRODUCT_ID @(
//     Common: {
//       ValueList: {
//         CollectionPath: 'vJunction',
//         Parameters: [
//           { $Type: 'Common.ValueListParameterInOut',
//             LocalDataProperty: PRODUCT_ID,
//             ValueListProperty: 'PRODUCT_ID'
//           },
//       ]
//       }
//     }
//   );
// }
// annotate  service. vJunction with {
//   UID_TYPE @(
//     Common: {
//       ValueList: {
//         CollectionPath: 'vJunction',
//         Parameters: [
//           { $Type: 'Common.ValueListParameterInOut',
//             LocalDataProperty: UID_TYPE,
//             ValueListProperty: 'UID_TYPE'
//           },
//       ]
//       }
//     },
//   );
// }


annotate  service. vJunction with {
  UID_TYPE @(
    Common: {
      ValueListWithFixedValues : true,
      ValueList: {
        CollectionPath: 'uView',
        Parameters: [
          { $Type: 'Common.ValueListParameterInOut',
            LocalDataProperty: UID_TYPE,
            ValueListProperty: 'UID_TYPE'
          },
      ]
      }
    },
  );
}











annotate  service. vJunction with {
  PRODUCT_ID @(
    Common: {
      ValueListWithFixedValues : true,
      ValueList: {
        CollectionPath: 'pView',
        Parameters: [
          { $Type: 'Common.ValueListParameterInOut',
            LocalDataProperty: PRODUCT_ID,
            ValueListProperty: 'PRODUCT_ID'
          },
      ]
      }
    },
  );
}
