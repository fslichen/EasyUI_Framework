package evolution.lightweight;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

@Service
public class LightWeightService {
	public Map<String, String> toMap(HttpServletRequest request) {
		Enumeration<String> parameterKeys = request.getParameterNames();
		Map<String, String> parameterMap = new HashMap<>();
		while (parameterKeys.hasMoreElements()) {
			String parameterKey = parameterKeys.nextElement();
			parameterMap.put(parameterKey, request.getParameter(parameterKey));
		}
		return parameterMap;
	}
	
	public <T> T toT(HttpServletRequest request, Class<T> clazz) throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		Enumeration<String> parameterKeys = request.getParameterNames();
		T t = clazz.newInstance();
		Method[] methods = clazz.getMethods();
		Map<String, Method> setterMethods = new HashMap<>();
		Map<String, Class<?>> setterMethodParameterTypes = new HashMap<>();
		for (Method method : methods) {
			if (method.getName().startsWith("set")) {
				Class<?>[] parameterTypes = method.getParameterTypes();
				if (parameterTypes.length == 1) {
					String methodName = method.getName();
					setterMethods.put(methodName, method);
					setterMethodParameterTypes.put(methodName, parameterTypes[0]);
				}
			}
		}
		while (parameterKeys.hasMoreElements()) {
			String parameterKey = parameterKeys.nextElement();
			String parameterValue = request.getParameter(parameterKey);
			String setterMethodName = "set" + parameterKey.substring(0, 1).toUpperCase() + parameterKey.substring(1);
			Method setterMethod = setterMethods.get(setterMethodName);
			Class<?> setterMethodParameterType = setterMethodParameterTypes.get(setterMethodName);
			if (setterMethodParameterType == String.class) {
				setterMethod.invoke(t, parameterValue);
			} else if (setterMethodParameterType == int.class || setterMethodParameterType == Integer.class) {
				setterMethod.invoke(t, new Integer(parameterValue));
			} else if (setterMethodParameterType == double.class || setterMethodParameterType == Double.class) {
				setterMethod.invoke(t, new Double(parameterValue));
			} else if (setterMethodParameterType == boolean.class || setterMethodParameterType == Boolean.class) {
				setterMethod.invoke(t, new Boolean(parameterValue));
			} else if (setterMethodParameterType == Date.class) {
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM/dd/yyyy");
				try {
					setterMethod.invoke(t, simpleDateFormat.parse(parameterValue));
				} catch (Exception e0) {
					simpleDateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
					try {
						setterMethod.invoke(t, simpleDateFormat.parse(parameterValue));
					} catch (Exception e1) {
						// Add more criteria for parsing date.
					}
				}
			}// TODO Add more criteria such as short, byte etc. 
		}
		return t;
	}
}
