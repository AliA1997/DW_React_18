import { observer } from 'mobx-react-lite';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import { CustomerDetails } from '../../app/models/customer';
import { format } from 'date-fns';
import { useStore } from '../../app/stores/store';
import { toast } from 'react-toastify';

interface Props {
    customerDetails: CustomerDetails;
}

export default observer(function CustomerCard({customerDetails}: Props) {
    const { customerStore } = useStore();

    return (
        <Card className="customer-card">
            <Image size='small' circular centered bordered src={customerDetails.avatar || '/assets/user.png'} />
            <Card.Content>
                <Card.Meta><b>Id:</b> 
                <Label as='a' color='blue' onClick={async (e) => {
                    e.stopPropagation();
                    try {
                        await navigator.clipboard.writeText(customerDetails.id);
                        toast.success('Copied Id to clipboard');
                      } catch (err) {
                        console.error('Failed to copy:', err);
                        toast.success('Copy failed!');
                      }
                }}>
                {customerDetails.id}
                </Label>
                </Card.Meta>
                <Card.Header>{customerDetails.lastName}, {customerDetails.firstName}</Card.Header>
                <Card.Description>{customerDetails.email}</Card.Description>
                <Card.Description>{customerDetails.phoneNumber}</Card.Description>
                <Card.Description>Favorite Color: {customerDetails.favoriteColor}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                <Card.Meta>Age: {customerDetails.age}</Card.Meta>
                <Card.Meta>Date of Birth: {format(new Date(customerDetails.birthday), 'MM/dd/yyyy')}</Card.Meta>
            </Card.Content>
            <Button type='button' style={{background: 'red'}} onClick={(e) => {
                e.stopPropagation();
                customerStore.deleteCustomer(customerDetails.id);
            }}>
                Delete
            </Button>
            {/* <FollowButton profile={profile} /> */}
        </Card>
    )
})