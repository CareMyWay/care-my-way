import {Input} from "@/components/inputs/input";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

const MultipleSelect = (
  {
    subTitle,
    itemOptionLabels,
    itemOptionValues,
    selectedItems,
    setSelectedItems
  }: {
    subTitle: string;
    itemOptionLabels: string[];
    itemOptionValues: string[];
    selectedItems: string[];
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  } ) => {

  const { t } = useTranslation();

  // const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [itemFilter, setItemFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const optionsLabelPool = [... itemOptionLabels];
  const optionsValuePool = [... itemOptionValues];

  const updSelectedItems = (itemLabel : string , isAdding: boolean) =>{

    const itemValue = optionsValuePool[optionsLabelPool.findIndex(option => option === itemLabel)];

    if (selectedItems.some((item) => itemValue === item)){
      if(isAdding){
        return;
      } else {
        const index = selectedItems.indexOf(itemValue);
        setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
      }
    } else {
      if(isAdding){
        setSelectedItems([...selectedItems, itemValue.trim()]);
      } else {
        return;
      }
    }

  };

  const handleBlur = () => {
    // Delay, so onClick on list items can fire first
    setTimeout(() => setIsOpen(false), 250);
  };

  const filteredOptions = optionsLabelPool.filter(option =>
    option.toLowerCase().includes(itemFilter.toLowerCase())
  );

  return (
    <div className="mb-6">
      {subTitle !=="" && <h3 className="text-[16px] text-darkest-green mb-3">{subTitle}</h3>}
      <div className="flex flex-wrap gap-2 mb-3">
        {
          selectedItems.map((item, index) => (
            <div key={index} className="px-4 py-1 rounded-full border border-input-border-gray text-darkest-green text-sm hover:bg-gray-200">
              {t(item)}
              <button
                className="font-extrabold text-[23px] ml-2 align-middle"
                onClick={() => updSelectedItems(t(item), false)}>&times;</button>
            </div>
          ))
        }
      </div>


      <div className="relative">
        <Input
          type="text"
          value={itemFilter}
          placeholder={t("Search")}
          className="w-full h-[41px]"
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          onChange={e => setItemFilter(e.target.value)}
        />

        {isOpen && (
          <ul className="absolute z-10 w-full bg-primary-white border text-darkest-green rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setItemFilter("");
                    updSelectedItems(option, true);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export { MultipleSelect };
