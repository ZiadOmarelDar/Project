import Card from 'react-bootstrap/Card';

function BasicExample() {
	return (
		<Card style={{ width: '18rem' }}>
			<Card.Img
				variant='top'
				src='holder.js/100px180'
			/>
			<Card.Body>
				<Card.Title>Product Name</Card.Title>
				<Card.Text>190 L.E</Card.Text>
			</Card.Body>
		</Card>
	);
}

export default BasicExample;
