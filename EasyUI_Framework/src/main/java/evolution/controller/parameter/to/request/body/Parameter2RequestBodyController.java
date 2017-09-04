package evolution.controller.parameter.to.request.body;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/servlet")
public class Parameter2RequestBodyController {
	@GetMapping("/get")
	public void post(HttpServletRequest request) throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		AnyDto anyDto = toT(request, AnyDto.class);
		System.out.println(anyDto);
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
			}// TODO Add more criteria, especially date.
		}
		return t;
	}
};