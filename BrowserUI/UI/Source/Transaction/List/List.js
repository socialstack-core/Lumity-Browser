
export default function List(props) {
	
	// Temporary transaction set.
	var setFieldsDefinition = {
		Id: 7,
		Name: 'Blockchain.SetFields'
	};
	
	var entityIdField = {
		Id: 16,
		Name: 'EntityId',
		DataType: 'uint'
	};
	
	var definitionIdField = {
		Id: 17,
		Name: 'DefinitionId',
		DataType: 'uint'
	};
	
	var usernameField = {
		Id: 24,
		Name: 'Username',
		DataType: 'string'
	};
	
	var userDefinition = {
		Id: 12,
		Name: 'User'
	};
	
	var definitions = [
		setFieldsDefinition,
		userDefinition
	];
	
	var fieldDefinitions = [
		entityIdField,
		definitionIdField,
		usernameField
	];
	
	var schema = {
		Fields: fieldDefinitions,
		Definitions: definitions
	};
	
	var transactions = [
		{
			// Create a user. The user ID will be the transactionID unless an ID field is specified.
			Definition: userDefinition, // User type
			TransactionId: 104,
			Header: [
				// In the raw transaction, anything before the Timestamp is considered a header field. Particular header fields are required for certain core definitions.
				// No header fields are required when instancing a definition (creating a user). If an ID is specified, it is presented in here.
			],
			Fields: [
				{
					Field: usernameField,
					Value: 'HistoricSteve' // Username = HistoricSteve
				}
			]
		},
		{ // Set Username='Steve' on User #104
			Definition: setFieldsDefinition, // This transaction is setting fields
			Timestamp: 81737437837845, // This is when it occurred
			TransactionId: 180, // This is its ID
			Header: [ // In the raw transaction, anything before the Timestamp is considered a header field. Particular header fields are required for certain core definitions.
				{
					Field: definitionIdField,
					Value: 12 // User definition
				},
				{
					Field: entityIdField,
					Value: 104 // The User ID
				}
			],
			Fields: [
				{
					Field: usernameField,
					Value: 'Steve' // Username = Steve
				}
			]
		}
	];
	
	// Infinite scroll based listing? or paginated? 
	// It could potentially be millions of transactions - The number of transactions isn't known if we are seeking backwards, but an approximation can be obtained.
	
	return (
		<div className="transaction-list">
			{transactions.map(txn => {
				
				return <div className="transaction-list__transaction">
					{txn.TransactionId}
				</div>
				
			})}
		</div>
	);
}
