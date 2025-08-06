import { Select } from "@/components/select/standardSelect";
import { useTranslation } from "react-i18next";
import "/src/components/language-switch/i18n";


export default function LanguageSwitcher( ) {
    const { i18n } = useTranslation();

    const switchTo = async (lng: string) => {
        await i18n.changeLanguage(lng);
    };

    return (
      <>
          {/*<p>[{i18n.getResource("zhcn", "common", "Companionship")}]</p>*/}
          <Select
            onChange={(e) => switchTo(e.target.value) }
            value={i18n.language}
          >
              <option value="en">English</option>       {/* English             */}
              <option value="fr">Français</option>      {/* French              */}
              <option value="es">Español</option>       {/* Spanish             */}
              <option value="zhcn">简体中文</option>     {/* Simplified Chinese   */}
              <option value="pa">ਪੰਜਾਬੀ</option>          {/* Punjabi              */}
              <option value="ar">العربية</option>       {/* Arabic               */}
              <option value="hi">हिन्दी</option>           {/* Hindi                */}
              <option value="tl">Tagalog</option>       {/* Tagalog             */}
              <option value="zhtw">繁體中文</option>     {/* Traditional Chinese  */}
              <option value="it">Italiano</option>      {/* Italian             */}
              <option value="de">Deutsch</option>       {/* German              */}
              <option value="ur">اردو</option>          {/* Urdu                 */}
              <option value="pt">Português</option>     {/* Portuguese          */}
              <option value="ru">Русский</option>       {/* Russian             */}
              <option value="ta">தமிழ்</option>         {/* Tamil                */}
              <option value="vi">Tiếng Việt</option>    {/* Vietnamese          */}
              <option value="fa">فارسی</option>         {/* Persian              */}
              <option value="gu">ગુજરાતી</option>         {/* Gujarati             */}
              <option value="ko">한국어</option>         {/* Korean              */}
              <option value="pl">Polski</option>        {/* Polish              */}
              <option value="el">Ελληνικά</option>      {/* Greek               */}
              <option value="uk">Українська</option>    {/* Ukrainian           */}
              <option value="bn">বাংলা</option>          {/* Bengali              */}
              <option value="ro">Română</option>        {/* Romanian            */}
              <option value="he">עברית</option>         {/* Hebrew              */}
          </Select>
      </>
    );
}
