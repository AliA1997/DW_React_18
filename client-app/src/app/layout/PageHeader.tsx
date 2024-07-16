import { observer } from 'mobx-react-lite';
import React from 'react';
import { Divider, Header } from 'semantic-ui-react';

interface Props {
    header: string;
}

export default observer(function PageHeader({header}: Props) {
    return (
		<>
            <Header as='h1' content={header} className='pageheader' />
			<Divider />
		</>
    )
})