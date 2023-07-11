import { IndexTable, LegacyCard, TextField } from '@shopify/polaris';
import React from 'react'

function Variants({ variants, updateVariant, isUpdating }) {
  return (
    <LegacyCard sectioned title="Variants">
        <IndexTable 
            itemCount={variants.length} 
            resourceName={{singular: 'variant', plural: 'variants'}}
            headings={[
                {title: 'Variant'},
                {title: 'Price'}
            ]}
            selectable={false}
        >
            {
                variants.map((variant, index) => (
                    <IndexTable.Row key={index}>
                        <IndexTable.Cell>
                            <TextField label="Variant Title" labelHidden value={variant.title} disabled readOnly/>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <TextField label="Variant Price" labelHidden value={variant.price} type="number" prefix="$" onChange={price => updateVariant(variant.id, price)} disabled={isUpdating} />
                        </IndexTable.Cell>
                    </IndexTable.Row>
                ))
            }
        </IndexTable>
    </LegacyCard>
  );
}

export default Variants;