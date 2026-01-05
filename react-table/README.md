# react-table

![gemstone logo](https://raw.githubusercontent.com/gemstone/web/master/docs/img/gemstone-wide-600.png)

The Gemstone Web Library organizes all Gemstone functionality related to web.

[![GitHub license](https://img.shields.io/github/license/gemstone/web?color=4CC61E)](https://github.com/gemstone/web/blob/master/LICENSE)

This library includes strongly-typed table components in React.

## Usage 

### Table

Table provides the simplest table component, without any special configurations.

```ts
/** simple interface for data */
interface IPet {
  Name: string
  Species: 'dog' | 'cat' | 'ferret' | 'fish'
  Age: number
}

/** example data for this example table */
const tableData: IPet[] = [
  {
    Name: 'Mouse',
    Species: 'cat',
    Age: 3
  }, 
  {
    Name: 'Party Socks',
    Species: 'cat',
    Age: .4
  }
]

function TableExample() {
  return (
    <>
    <Table<IPet>
        Data={tableData}
        SortKey={''}
        Ascending={true}
        OnSort={(d, e) => {}}
        KeySelector={(_item, index) => index}
        >
        <Column<IPet>
            Key={'Name'}
            Field={'Name'}
        >
            Name
        </Column>
        <Column<IPet>
            Key={'Species'}
            Field={'Species'}
            >
            Species
        </Column>
        <Column<IPet>
            Key={'Age'}
            Field={'Age'}
            >
            Age
        </Column>
    </Table>
    </>
  )
}
```
![TableExample](https://raw.githubusercontent.com/GridProtectionAlliance/gpa-gemstone/docs/react-table/img/react-table_usage-table.png)

### ConfigurableTable

ConfigurableTable, unlike Table, offers configurations for the user to select which columns are visible. Note the gear icon in the corner of the table.

```ts
/** simple interface for data */
interface IPet {
  Name: string
  Species: 'dog' | 'cat' | 'ferret' | 'fish'
  Age: number
}

/** example data for this example table */
const tableData: IPet[] = [
  {
    Name: 'Mouse',
    Species: 'cat',
    Age: 3
  }, 
  {
    Name: 'Party Socks',
    Species: 'cat',
    Age: .4
  }
]

function ConfigurableTableExample() {

  return (
    <>
      <div>
        {/** ConfigurableTable takes the place of the Table component. */}
        <ConfigurableTable<IPet>
          Data={tableData}
          SortKey={''}
          Ascending={true}
          OnSort={(d, e) => {}}
          KeySelector={(_item, index) => index}
          >
            {/** ConfigurableColumn wraps around the Column component. */}
            <ConfigurableColumn Key={'Name'} Label={'Name'} Default={true}>
                <Column<IPet>
                Key={'Name'}
                Field={'Name'}
                >
                Name
                </Column>
            </ConfigurableColumn>
            <ConfigurableColumn Key={'Species'} Label={'Species'} Default={true}>
                <Column<IPet>
                Key={'Species'}
                Field={'Species'}
                >
                Species
                </Column>
            </ConfigurableColumn>
            <ConfigurableColumn Key={'Age'} Label={'Age'} Default={true}>
                <Column<IPet>
                Key={'Age'}
                Field={'Age'}
                >
                Age
                </Column>
            
            </ConfigurableColumn>
        </ConfigurableTable>
      </div>
    </>
  )
}
```

![ConfigurableTableExample](https://raw.githubusercontent.com/GridProtectionAlliance/gpa-gemstone/docs/react-table/img/react-table_usage-configurable-table.png)

![ConfigurableTableExampleWithModal](https://raw.githubusercontent.com/GridProtectionAlliance/gpa-gemstone/docs/react-table/img/react-table_usage-configurable-table-with-modal.png)

### Paging

Paging can be implemented with the Paging component. 
Notice that, when rendered, the Paging component provides a one-indexed list, while the underlying data structure is zero-indexed.

``` ts
function PagingExample() {
    
    const ExampleData = ['cat', 'dog', 'ferret', 'fish', 'giraffe','elephant','vulture','jellyfish']

    /** This variable will hold the current page state.*/
    const currentPage = 1;

    /** Use a React hook to manage page state. */
    const [page, setPage] = React.useState<number>(currentPage);
    return (
        <>
            <Paging
                {/** The visible component for pagination is one-indexed. */}
                Current={page + 1}

                {/** Set the maximum page count. */}
                Total={ExampleData.length}

                {/** setPage must be adjusted for the original zero indexed list */}
                SetPage={(p) => setPage(p - 1)}
            />
            <h1 className={'position-absolute top-10 start-50 translate-middle'}>{ExampleData[page]}</h1>

        </>
    )
}
```

![PagingExample](https://raw.githubusercontent.com/GridProtectionAlliance/gpa-gemstone/docs/react-table/img/react-table_usage-paging.png)