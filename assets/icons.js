import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
    index: (props)=> <AntDesign name="home" size={26} {...props} />,
    programs: (props)=> <Feather name="compass" size={26} {...props} />,
    history: (props)=> <AntDesign name="calendar" size={26} {...props} />,
    progress: (props)=> <AntDesign name="linechart" size={26} {...props} />,
    settings: (props)=> <AntDesign name="setting" size={26} {...props} />,
}