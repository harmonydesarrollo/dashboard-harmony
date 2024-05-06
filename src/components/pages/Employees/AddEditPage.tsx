import AddEmployeePage from './AddEmployeePage';
import EditEmployeePage from './EditEmployeePage';

interface AddEditPageProps {
  showAdd: boolean;
  data: any;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const AddEditPage: React.FC<AddEditPageProps> = ({ showAdd, data, onSave, onCancel }) => {
  return (
    <div>
      {showAdd ? (
        <AddEmployeePage onSave={onSave} onCancel={onCancel} data={undefined} />
      ) : (
        <EditEmployeePage data={data} onSave={onSave} onCancel={onCancel} />
      )}
    </div>
  );
};

export default AddEditPage;
